const socket = io();

socket.emit('serverAdmin', 'df');
socket.on('admin', site => {
  var uploader = new SocketIOFileUpload(socket);

  socket.on('result', text => alert(text));
  const adminInfoTemplate = document.querySelector('#adminInfoTemplate')
    .innerHTML;
  const htmlInfo = Mustache.render(adminInfoTemplate, site.site);
  document.querySelector('.forms').insertAdjacentHTML('afterbegin', htmlInfo);

  const adminProjectTemplate = document.querySelector('#adminProjectTemplate')
    .innerHTML;
  const htmlProject = Mustache.render(adminProjectTemplate);
  document.querySelector('.forms').insertAdjacentHTML('beforeend', htmlProject);

  site.projects.forEach(project => {
    const id = project._id.toString();
    const adminProjectUpdateTemplate = document.querySelector(
      '#adminProjectUpdateTemplate'
    ).innerHTML;
    const htmlUpdateProject = Mustache.render(adminProjectUpdateTemplate, {
      ...project,
      id,
    });
    document
      .querySelector('.forms')
      .insertAdjacentHTML('beforeend', htmlUpdateProject);
  });

  document.querySelector('#info').addEventListener('submit', e => {
    e.preventDefault();
    const name = document.querySelector('.info__name').value;
    const position = document.querySelector('.info__position').value;
    const info = document.querySelector('.info__info').value;

    let list = [];
    document.querySelectorAll('.info__item-block').forEach(block => {
      list.push(block.firstElementChild.value);
    });

    let contact = [];
    document.querySelectorAll('.info__contacts-block').forEach(block => {
      contact.push({
        icon: block.firstElementChild.value,
        link: block.firstElementChild.nextElementSibling.value,
      });
    });

    if (document.querySelector('.info__photo').files[0]) {
      const photo = document.querySelector('.info__photo').files[0];
      socket.emit('updateSite', {
        name,
        position,
        photo: { name: photo.name, image: photo },
        info,
        list,
        contact,
        id: site.site._id,
      });
    } else
      socket.emit('updateSite', {
        name,
        position,
        info,
        list,
        contact,
        id: site.site._id,
      });
  });

  document.querySelector('#project').addEventListener('submit', e => {
    e.preventDefault();
    const title = document.querySelector('.project__heading').value;
    const info = document.querySelector('.project__info').value;
    let media = [];

    document.querySelectorAll('.project__video-block').forEach(block => {
      if (block.firstElementChild.files[0].type.includes('image'))
        media.push({
          data: block.firstElementChild.files[0],
          name: block.firstElementChild.files[0].name,
          type: 'image',
        });
      else if (block.firstElementChild.files[0].type.includes('video'))
        media.push({
          data: block.firstElementChild.files[0],
          name: block.firstElementChild.files[0].name,
          type: 'video',
        });
    });

    socket.emit('addNewProject', { title, info, media });
  });
  uploader.listenOnSubmit(
    document.querySelector('#project'),
    document.querySelector('.project__video-block').firstElementChild
  );

  document.querySelectorAll('form.project').forEach(project => {
    site.projects.forEach(elem => {
      const id = elem._id.toString();
      if (project.id === id) {
        project.firstElementChild.addEventListener('click', e => {
          console.log(project.id);
          console.log(
            project.firstElementChild.nextElementSibling.nextElementSibling
              .value
          );
          if (
            confirm(
              'Are you sure you wat to delite project ' +
                project.firstElementChild.nextElementSibling.nextElementSibling
                  .value
            )
          ) {
            socket.emit('deleteProject', project.id);
            project.style.display = 'none';
          }
        });
        project.addEventListener('submit', e => {
          e.preventDefault();
          const title =
            e.target.lastElementChild.previousElementSibling
              .previousElementSibling.previousElementSibling.value;
          const info =
            e.target.lastElementChild.previousElementSibling
              .previousElementSibling.value;
          let media = [];
          if (
            document.querySelectorAll('.project__media-block-' + id)[0]
              .firstElementChild.files[0]
          ) {
            document
              .querySelectorAll('.project__media-block-' + id)
              .forEach(block => {
                if (block.firstElementChild.files[0].type.includes('image'))
                  media.push({
                    data: block.firstElementChild.files[0],
                    name: block.firstElementChild.files[0].name,
                    type: 'image',
                  });
                else if (
                  block.firstElementChild.files[0].type.includes('video')
                )
                  media.push({
                    data: block.firstElementChild.files[0],
                    name: block.firstElementChild.files[0].name,
                    type: 'video',
                  });
              });
            console.log(media);
            socket.emit('addUpdateProject', { title, info, media, id });
          } else socket.emit('addUpdateProject', { title, info, id });
        });
      }
    });
  });

  document.querySelector('.info__list').addEventListener('click', e => {
    if (e.target.parentElement.classList.contains('info__item-plus')) {
      const plus = e.target.parentElement;
      if (
        plus.previousElementSibling.value.length > 0 &&
        plus.parentElement.parentElement.lastElementChild.firstElementChild
          .value.length > 0
      ) {
        document.querySelector('.info__list').insertAdjacentHTML(
          'beforeend',
          `<div class="info__item-block">
        <input type="text" class="info__item" placeholder="List Element">
        <div class="info__item-plus"><i class="fas fa-plus"></i></div>
    </div>`
        );
      }
      if (
        plus.previousElementSibling.value.length === 0 &&
        plus.parentElement.firstElementChild !==
          document.querySelector('.info__item')
      ) {
        plus.parentElement.parentNode.removeChild(plus.parentElement);
      }
    }
  });

  document.querySelector('.info__contacts').addEventListener('click', e => {
    if (e.target.parentElement.classList.contains('info__item-plus')) {
      const plus = e.target.parentElement;
      if (
        plus.previousElementSibling.value.length > 0 &&
        plus.previousElementSibling.previousElementSibling.value.length > 0 &&
        plus.parentElement.parentElement.lastElementChild.firstElementChild
          .value.length > 0 &&
        plus.parentElement.parentElement.lastElementChild.firstElementChild
          .nextElementSibling.value.length > 0
      ) {
        document.querySelector('.info__contacts').insertAdjacentHTML(
          'beforeend',
          `<div class="info__contacts-block">
        <input type="text" class="info__contact-icon" placeholder="Social Icon" required>
        <input type="text" class="info__contact-link" placeholder="Social Link" required>
        <div class="info__item-plus"><i class="fas fa-plus"></i></div>
    </div>`
        );
      }
      if (
        plus.previousElementSibling.value.length === 0 &&
        plus.previousElementSibling.previousElementSibling.value.length === 0 &&
        plus.parentElement.firstElementChild !==
          document.querySelector('.info__contact-icon') &&
        plus.parentElement.firstElementChild.nextElementSibling !==
          document.querySelector('.info__contact-link')
      ) {
        plus.parentElement.parentNode.removeChild(plus.parentElement);
      }
    }
  });

  document.querySelectorAll('.project__video').forEach(elem => {
    elem.parentElement.parentElement.addEventListener('click', e => {
      if (e.target.parentElement.classList.contains('project__plus')) {
        const plus = e.target.parentElement;
        if (
          plus.previousElementSibling.files[0] &&
          plus.parentElement.parentElement.lastElementChild.firstElementChild
            .files[0] &&
          plus.parentElement.parentElement.parentElement.id === 'project'
        ) {
          plus.parentElement.parentElement.insertAdjacentHTML(
            'beforeend',
            `<div class="project__video-block">
                <input class="project__video" id="video__video"  type="file" name="video" placeholder="Video" accept="image/*, video/*" required>
                <div class="project__plus"><i class="fas fa-plus"></i></div>
            </div>`
          );
        } else if (
          plus.previousElementSibling.files[0] &&
          plus.parentElement.parentElement.lastElementChild.firstElementChild
            .files[0]
        ) {
          plus.parentElement.parentElement.insertAdjacentHTML(
            'beforeend',
            `<div class="project__media-block project__media-block-${plus.parentElement.parentElement.parentElement.id}">
                <input class="project__video" id="video__video"  type="file" name="video" placeholder="Media" accept="image/*, video/*" required>
                <div class="project__plus"><i class="fas fa-plus"></i></div>
            </div>`
          );
        }
        if (
          !plus.previousElementSibling.files[0] &&
          plus.parentElement.firstElementChild !=
            plus.parentElement.parentElement.parentElement.lastElementChild
              .previousElementSibling.firstElementChild.nextElementSibling
              .firstElementChild
        ) {
          plus.parentElement.parentNode.removeChild(plus.parentElement);
        }
      }
    });
  });
});
