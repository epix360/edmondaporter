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
            upload: async (file) => {
                try {
                    const formData = new FormData();
                    formData.append("file", file);
                    formData.append("folder", `edmondaporter`);
                    formData.append("upload_preset", "hrbbhef2");

                    const response = await fetch(
                        "https://api.cloudinary.com/v1_1/dzfjji5xy/image/upload",
                        {
                            method: "POST",
                            body: formData
                        }
                    );

                    const result = await response.json();
                    const { secure_url, public_id } = result;
                    cloudinaryPublicIds.push(public_id);
                    imageInput.value = cloudinaryPublicIds;
                    return secure_url;
                } catch (error) {
                    console.error("Error:", error);
                    throw new Error("Upload failed");
                }
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
    const contents = quill.getContents();
    console.log('contents', contents);
    let html = `contents = ${JSON.stringify(contents, null, 2)}`;
    if (delta) {
        console.log('change', delta);
        html = `change = ${JSON.stringify(delta, null, 2)}\n\n${html}`;
    }

    const inputs = [bioInput, blogInput, publicationInput, linkInput, homeInput];
    inputs.forEach(input => {
        if (input) {
            input.value = quill.root.innerHTML;
        }
    });

    const imgElements = document.querySelectorAll('.ql-editor img');
    imgElements.forEach(imgElement => {
        const imgUrl = imgElement.src;
        const imgSplit = imgUrl.split('/').pop();
        const imgId = `edmondaporter/${imgSplit.split('.').shift()}`;
        imgElement.setAttribute('id', imgId);
    });
}

// Select the node that will be observed for mutations
const targetNode = document.body;
// Options for the observer (which mutations to observe)
const config = { attributes: true, attributeOldValue: true, childList: true, subtree: true };

const callback = (mutationList, observer) => {
    for (let mutation of mutationList) {
        const attributes = mutation.removedNodes[0]?.attributes;
        if (attributes) {
            const imageId = attributes[1]?.value;
            if (imageId) {
                idsToDestroy.push(imageId);
                const imageIdsToDelete = idsToDestroy.join();
                document.querySelector('#imageIdsToDelete').value = imageIdsToDelete;
            }
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