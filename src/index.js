const express = require('express');
require('./db/mongoose');
const path = require('path');
const http = require('http');
const hbs = require('hbs');
const soketio = require('socket.io');
const SiteText = require('./models/siteText');
const Site = require('./models/site');
const Project = require('./models/project');
var SocketIOFileUpload = require('socketio-file-upload');
const fs = require('file-system');
const rimraf = require('rimraf');

// const port = 80 || process.env.PORT;
const port = 3000 || process.env.PORT;

const app = express();
const server = http.createServer(app);
const io = soketio(server);

//  Define paths for express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

//  Setup handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewPath);
hbs.registerPartials(partialsPath);
app.use(SocketIOFileUpload.router);

//  Setup sattic directory to serve
app.use(express.static(publicDirectoryPath));

io.on('connection', async socket => {
  console.log('New WebSocket connection');

  socket.on('serverAdmin', async () => {
    const currentTextState = await SiteText.findOne().sort({ created_at: -1 });
    const projects = await Project.find();
    socket.emit('admin', { site: currentTextState, projects });
  });

  socket.on('serverPortfolio', async () => {
    const currentState = await Site.findOne().sort({ created_at: -1 });
    socket.emit('start', { site: currentState });
    const projects = await Project.find().sort({ created_at: 1 });
    socket.emit('projects', projects);
  });

  socket.on(
    'updateSite',
    async ({ name, position, photo, info, list, contact, id }, callback) => {
      try {
        let site;
        if (photo)
          site = await Site.findByIdAndUpdate(id, {
            name,
            position,
            photo,
            info,
            list,
            contact,
          });
        else
          site = await Site.findByIdAndUpdate(id, {
            name,
            position,
            info,
            list,
            contact,
          });
        const siteText = await SiteText.findByIdAndUpdate(id, {
          name,
          position,
          info,
          list,
          contact,
        });
        // const site = new Site({ name, position, photo, info, list, contact });
        await site.save();
        await siteText.save();
        socket.emit('result', `Site information was successful updated.`);
        // callback(channel);
      } catch (e) {
        socket.emit('error', e);
      }
    }
  );

  socket.on('addNewProject', async ({ title, info, media }, callback) => {
    try {
      const project = new Project({ title, info, media });
      const id = project._id.toString();
      media.forEach(file => {
        fs.writeFile(`public/media/${id}/${file.name}`, file.data);
      });
      await project.save();
      if (!project) console.log('Pshol nah');
      socket.emit('result', `Project ${project.title} was successful added.`);
    } catch (e) {
      socket.emit('error', e);
    }
  });

  socket.on(
    'addUpdateProject',
    async ({ title, info, media, id }, callback) => {
      try {
        let project;
        if (!!media) {
          project = await Project.findByIdAndUpdate(id, { title, info, media });
          rimraf.sync(`public/media/${id}`);
          media.forEach(file => {
            fs.writeFile(`public/media/${id}/${file.name}`, file.data);
          });
        } else project = await Project.findByIdAndUpdate(id, { title, info });
        await project.save();
        if (!project) console.log('Pshol nah');
        socket.emit(
          'result',
          `Project ${project.title} was successfuly updated.`
        );
      } catch (e) {
        socket.emit('error', e);
      }
    }
  );

  socket.on('deleteProject', async id => {
    try {
      const project = await Project.findByIdAndDelete(id);
      rimraf.sync(`public/media/${id}`);
      await project.save();
      if (!project) console.log('Pshol nah');
      socket.emit(
        'result',
        `Project ${project.title} was successfuly deleted.`
      );
    } catch (e) {
      socket.emit('error', e);
    }
  });
});

server.listen(3000, () => console.log('Server is up on port', port));
