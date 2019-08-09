const socket = io();

socket.emit('serverAdmin', 'df');
socket.on('admin', (site) => {
    socket.on('result', (text) => alert(text));
    // console.log(site);
    const adminInfoTemplate = document.querySelector('#adminInfoTemplate').innerHTML;
    const htmlInfo = Mustache.render(adminInfoTemplate, site.site);
    document.querySelector('.forms').insertAdjacentHTML('afterbegin', htmlInfo);

    const adminProjectTemplate = document.querySelector('#adminProjectTemplate').innerHTML;
    const htmlProject = Mustache.render(adminProjectTemplate);
    document.querySelector('.forms').insertAdjacentHTML('beforeend', htmlProject);

    site.projects.forEach((project) => {
        // console.log(project)
        const id = project._id.toString();
        const adminProjectUpdateTemplate = document.querySelector('#adminProjectUpdateTemplate').innerHTML;
        const htmlUpdateProject = Mustache.render(adminProjectUpdateTemplate, {...project, id});
        document.querySelector('.forms').insertAdjacentHTML('beforeend', htmlUpdateProject);
    });

    document.querySelector('#info').addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.querySelector('.info__name').value;
        const position = document.querySelector('.info__position').value;
        const photo = document.querySelector('.info__photo').files[0];
        const info = document.querySelector('.info__info').value;

        // if(!photo) alerify('df');

     let list = [];
        document.querySelectorAll('.info__item-block').forEach((block) => {
            list.push(block.firstElementChild.value);
        });

        let contact = [];
        document.querySelectorAll('.info__contacts-block').forEach((block) => {
            contact.push({icon: block.firstElementChild.value, link: block.firstElementChild.nextElementSibling.value});
        });


        socket.emit('updateSite', {name, position, photo: { name: photo.name, image: photo}, info, list, contact, id: site.site._id });
        
    });

    document.querySelector('#project').addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.querySelector('.project__heading').value;
        const info = document.querySelector('.project__info').value;
        let media = [];

        // console.log(e.target.lastElementChild.previousElementSibling)
        document.querySelectorAll('.project__video-block').forEach((block) => {
            if(block.firstElementChild.files[0].type.includes('image')) media.push({ data: block.firstElementChild.files[0], type: 'image'});
            else if(block.firstElementChild.files[0].type.includes('video')) media.push({ data: block.firstElementChild.files[0], type: 'video'});
        });

        socket.emit('addNewProject', {title, info, media });
    });


    // id = project._id.toString();
    document.querySelectorAll('form.project').forEach((project) => {
        // console.log(project);
        site.projects.forEach((elem) => {
            const id = elem._id.toString();
            if(project.id === id){
                //  project.addEventListener('submit', )
                // console.log('gik')
                project.firstElementChild.addEventListener('click', (e) => {
                    if(confirm('Are you sure you wat to delite project ' + project.title)) {
                        socket.emit('deleteProject', id);
                        project.style.display = 'none';
                    }
                });
                project.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const title = e.target.lastElementChild.previousElementSibling.previousElementSibling.previousElementSibling.value;
                    const info = e.target.firstElementChild.nextElementSibling.nextElementSibling.value;
                    let media = [];

                    document.querySelectorAll('.project__media-block-' + id).forEach((block) => {
                        if(block.firstElementChild.files[0].type.includes('image')) media.push({ data: block.firstElementChild.files[0], type: 'image'});
                        else if(block.firstElementChild.files[0].type.includes('video')) media.push({ data: block.firstElementChild.files[0], type: 'video'});
                    });

                    // console.log(media, title, info);

                    socket.emit('addUpdateProject', {title, info, media, id });

                });
            }
        });
        // console.log(project.classList.contains(`${site.projects[0]._id.toString}`))
    });

    // document.querySelector(`#project.${id}`).addEventListener('submit', (e) => {
    //     e.preventDefault();
    //     console.log(e.targer)
    //     // const title = document.querySelector('.project__heading').value;
    //     // const info = document.querySelector('.project__info').value;
    //     // let media = [];

    //     // document.querySelectorAll('.project__video-block').forEach((block) => {
    //     //     if(block.firstElementChild.files[0].type.includes('image')) media.push({ data: block.firstElementChild.files[0], type: 'image'});
    //     //     else if(block.firstElementChild.files[0].type.includes('video')) media.push({ data: block.firstElementChild.files[0], type: 'video'});
    //     // });

    //     // socket.emit('addNewProject', {title, info, media });
    //     // socket.on('result', (data) => console.log(data));
    // });

document.querySelector('.info__list').addEventListener('click', (e) => {
if (e.target.parentElement.classList.contains('info__item-plus')) {
    const plus = e.target.parentElement;
    if(plus.previousElementSibling.value.length > 0 && plus.parentElement.parentElement.lastElementChild.firstElementChild.value.length > 0) {
        document.querySelector('.info__list').insertAdjacentHTML('beforeend', `<div class="info__item-block">
        <input type="text" class="info__item" placeholder="List Element" required>
        <div class="info__item-plus"><i class="fas fa-plus"></i></div>
    </div>`)
    };
    if(plus.previousElementSibling.value.length === 0 && plus.parentElement.firstElementChild !== document.querySelector('.info__item')) {
        plus.parentElement.parentNode.removeChild(plus.parentElement);
    }
  }
});

document.querySelector('.info__contacts').addEventListener('click', (e) => {
if (e.target.parentElement.classList.contains('info__item-plus')) {
    const plus = e.target.parentElement;
    if(plus.previousElementSibling.value.length > 0 && plus.previousElementSibling.previousElementSibling.value.length > 0 && plus.parentElement.parentElement.lastElementChild.firstElementChild.value.length > 0 && plus.parentElement.parentElement.lastElementChild.firstElementChild.nextElementSibling.value.length > 0) {
        document.querySelector('.info__contacts').insertAdjacentHTML('beforeend', `<div class="info__contacts-block">
        <input type="text" class="info__contact-icon" placeholder="Social Icon" required>
        <input type="text" class="info__contact-link" placeholder="Social Link" required>
        <div class="info__item-plus"><i class="fas fa-plus"></i></div>
    </div>`)
    };
    if(plus.previousElementSibling.value.length === 0 && plus.previousElementSibling.previousElementSibling.value.length === 0 && plus.parentElement.firstElementChild !== document.querySelector('.info__contact-icon') && plus.parentElement.firstElementChild.nextElementSibling !== document.querySelector('.info__contact-link')) {
        plus.parentElement.parentNode.removeChild(plus.parentElement);
    }
  }
});


document.querySelectorAll('.project__video').forEach((elem) => {
    // console.log(elem);
    elem.parentElement.parentElement.addEventListener('click', (e) => {
        // console.log(e.target.parentElement);
        if(e.target.parentElement.classList.contains('project__plus')) {
            // console.log(e.target.parentElement);
            
            // console.log('click', e.target.parentElement, e.target.parentElement.previousElementSibling.files[0]);
            const plus = e.target.parentElement;
            // console.log(plus.parentElement.firstElementChild, plus.parentElement.parentElement.parentElement.lastElementChild.previousElementSibling.firstElementChild.nextElementSibling.firstElementChild);
            // console.log(plus.parentElement.parentElement.parentElement.lastElementChild.previousElementSibling.lastElementChild.firstElementChild);
            // console.log(plus.previousElementSibling.files[0], plus.parentElement.parentElement.lastElementChild.firstElementChild.files[0])
            if(plus.previousElementSibling.files[0] && plus.parentElement.parentElement.lastElementChild.firstElementChild.files[0]) {
                plus.parentElement.parentElement.insertAdjacentHTML('beforeend', `<div class="project__video-block">
                <input class="project__video" id="video__video"  type="file" name="video" placeholder="Media" accept="image/*" required>
                <div class="project__plus"><i class="fas fa-plus"></i></div>
            </div>`)
            };
            if(!plus.previousElementSibling.files[0] && plus.parentElement.firstElementChild != plus.parentElement.parentElement.parentElement.lastElementChild.previousElementSibling.firstElementChild.nextElementSibling.firstElementChild) {
                plus.parentElement.parentNode.removeChild(plus.parentElement);
            }
        }
    });
});
// document.querySelector('.project__video-list').addEventListener('click', (e) => {
//     if (e.target.parentElement.classList.contains('project__plus')) {
//         const plus = e.target.parentElement;
//         if(plus.previousElementSibling.files[0] && plus.parentElement.parentElement.lastElementChild.firstElementChild.files[0]) {
//             document.querySelector('.project__video-list').insertAdjacentHTML('beforeend', `<div class="project__video-block">
//             <input class="project__video" id="video__video"  type="file" name="video" placeholder="Media" accept="image/*" required>
//             <div class="project__plus"><i class="fas fa-plus"></i></div>
//         </div>`)
//         };
//         if(!plus.previousElementSibling.files[0] && plus.parentElement.firstElementChild != document.querySelector('.project__video')) {
//             plus.parentElement.parentNode.removeChild(plus.parentElement);
//         }
//       }
//     });

});

        