Quill.register("modules/imageUploader", ImageUploader);

var toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],

    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
    [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
    [{ 'direction': 'rtl' }],                         // text direction

    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    [{ 'header': [2, 3, 4, 5, 6, false] }],
    ['link', 'image'],                              // link, media

    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    [{ 'font': [] }],
    [{ 'align': [] }],

    ['clean']                                         // remove formatting button
];

const quill = new Quill('#editor-container', {
    modules: {
        toolbar: {
            container: toolbarOptions
        },
        imageUploader: {
            upload: (file) => {
                return new Promise((resolve, reject) => {
                    const formData = new FormData();
                    formData.append("file", file);
                    formData.append("folder", `edmondaporter`);
                    formData.append("upload_preset", "hrbbhef2");

                    fetch(
                        "https://api.cloudinary.com/v1_1/dzfjji5xy/image/upload",
                        {
                            method: "POST",
                            body: formData
                        }
                    )
                        .then((response) => response.json())
                        .then((result) => {
                            var { secure_url, public_id } = result;
                            cloudinaryPublicIds.push(public_id);
                            imageInput.value = cloudinaryPublicIds;
                            resolve(secure_url)
                        })
                        .catch((error) => {
                            reject("Upload failed");
                            console.error("Error:", error);
                        });
                });
            }
        },
    },
    placeholder: 'Write your story...',
    theme: 'snow'
});

let cloudinaryPublicIds = [];
let imageInput = document.querySelector('#imageIds');
let imageIdsToDelete = document.querySelector('#imageIdsToDelete');
let idsToDestroy = [];

quill.on('text-change', update);
var bioInput = document.querySelector('input[id=bio]');
var blogInput = document.querySelector('input[id=content]');
var publicationInput = document.querySelector('input[id=content]');
var linkInput = document.querySelector('input[id=content]');
var homeInput = document.querySelector('input[id=content]');
update();

function update(delta) {
    var contents = quill.getContents();
    console.log('contents', contents);
    var html = "contents = " + JSON.stringify(contents, null, 2);
    if (delta) {
        console.log('change', delta)
        html = "change = " + JSON.stringify(delta, null, 2) + "\n\n" + html;
    }

    //EXTRACTS CLOUDINARY PUBLIC_ID FROM IMG URL AND ASSIGNS AS IMG ID IN HTML (ONLY WHEN IN .ql-editor)
    let imgs = document.querySelectorAll('.ql-editor img');
    let imgArr = [...imgs];
    for (let i = 0; i < imgArr.length; i++) {
        let imgUrl = imgArr[i].src;
        let imgSplit = imgUrl.split('/').pop();
        let imgId = "edmondaporter" + "/" + imgSplit.split('.').shift();
        imgArr[i].setAttribute("id", imgId);
    }

    if (bioInput) {
        bioInput.value = quill.root.innerHTML;
    }
    if (blogInput) {
        blogInput.value = quill.root.innerHTML;
    }
    if (publicationInput) {
        publicationInput.value = quill.root.innerHTML;
    }
    if (linkInput) {
        linkInput.value = quill.root.innerHTML;
    }
    if (homeInput) {
        homeInput.value = quill.root.innerHTML;
    }
}

// Select the node that will be observed for mutations
const targetNode = document.body;
// Options for the observer (which mutations to observe)
const config = { attributes: true, attributeOldValue: true, childList: true, subtree: true };

// Callback function to execute when mutations are observed
const callback = (mutationList, observer) => {
    for (let mutation of mutationList) {
        let attributes;
        if (attributes) {
            idsToDestroy.push(mutation.removedNodes[0].attributes[1].value)
            let imageIdsToDelete = idsToDestroy.toString();
            let idsToDeleteInput = document.querySelector('#imageIdsToDelete');
            idsToDeleteInput.value = imageIdsToDelete;
        }
    }
};

// Create an observer instance linked to the callback function
const observer = new MutationObserver(callback)

// Start observing the target node for configured mutations
observer.observe(targetNode, config);

//SINGLE IMAGE UPLOADER SHOW/HIDE (HOME, ABOUT)
const updatePhotoBtn = document.querySelector('#updatePhotoBtn');
const cancelBtn = document.querySelector('#cancelBtn');

[updatePhotoBtn, cancelBtn].forEach(function (el) {
    el.addEventListener("click", function () {
        const uploader = document.querySelector('#uploader');
        const currentPic = document.querySelector('#currentPic');
        uploader.classList.toggle("d-none");
        currentPic.classList.toggle("d-none");
    });
})