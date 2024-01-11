tinyMCE.PluginManager.add("tinymcedampicker", (editor, url) => {

    var tooltipPlaceholder = "Optimizely DAM selector";
    var dialog;
    var selectedImageData = {
        src: '',
        alt: '',
        dimensions: {
            width: '',
            height: ''
        }
    };

    var openDialog = function () {
        return editor.windowManager.open({
            title: 'Optimizely DAM Image Selector',
            body: {
                type: 'panel',
                items: [
                    {
                        name: 'src',
                        type: 'input',
                        label: 'Source'
                    },
                    {
                        type: 'input',
                        name: 'alt',
                        label: 'Alternative desription'
                    },
                    {
                        name: 'dimensions',
                        type: 'sizeinput'
                    }
                ]
            },
            buttons: [
                {
                    type: 'cancel',
                    text: 'Cancel'
                },
                {
                    type: 'custom',
                    text: 'Change image',
                    onAction: function () {
                        openWindow();
                    }
                },
                {
                    type: 'submit',
                    text: 'Insert / Update image',
                    primary: true
                }
            ],
            onAction: function () {
                openWindow();
            },
            onSubmit: function (api) {
                var data = api.getData();
                editor.insertContent('<img width="' + data.dimensions.width + '" height="' + data.dimensions.height + '" src="' + data.src + '" alt="' + data.alt + '"></img>');
                delete dialog;
                api.close();
            }
        });
    };

    const handleChoose = (event) => {
        const imageData = event.data[0];
        if (imageData) {
            var altText = event.data[0].title;
            if (event.data[0].alt && event.data[0].alt != '') {
                altText = event.data[0].alt;
            }
            var damData = {
                src: event.data[0].url,
                alt: altText,
                dimensions: {
                    width: '' + event.data[0].width.toString(),
                    height: '' + event.data[0].height.toString()
                }
            };

            dialog.setData(damData);
        }
    };

    var updateButton = function (button) {
        var selectedElement = editor.selection.getNode();

        selectedImageData.src = '';
        selectedImageData.alt = '';
        selectedImageData.dimensions.height = '';
        selectedImageData.dimensions.width = '';

        if (selectedElement && selectedElement.tagName === "IMG" && editor.dom.getAttrib(selectedElement, "class").indexOf("libItem") === -1) {

            selectedImageData.src = editor.dom.getAttrib(selectedElement, "src");
            selectedImageData.alt = editor.dom.getAttrib(selectedElement, "alt");
            selectedImageData.dimensions.height = editor.dom.getAttrib(selectedElement, "width");
            selectedImageData.dimensions.width = editor.dom.getAttrib(selectedElement, "height");

            var buttonRef = document.querySelector("button[title='" + tooltipPlaceholder + "'");
            if (buttonRef) {
                buttonRef.classList.add("tox-tbtn--enabled");
            }
        }
        else {
            var buttonRef = document.querySelector("button[title='" + tooltipPlaceholder + "'");
            if (buttonRef) {
                buttonRef.classList.remove("tox-tbtn--enabled");
            }
        }
    };

    const openWindow = () => {
        const options = {
            assetTypes: ['image'],
            multiSelect: true
        };
        const encodedOptions = window.btoa(JSON.stringify(options));
        window.open(`https://cmp.optimizely.com/cloud/library-picker?pickerOptions=${encodedOptions}`, 'Library', 'popup');
        window.addEventListener("message", handleChoose, false);
    }

    editor.ui.registry.addIcon('library-icon', '<svg height="24" width="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15.84 15.84"><path fill="#444" d="M3.48,13.06a.64.64,0,0,1-.64-.64v-9a.64.64,0,1,1,1.27,0v9A.64.64,0,0,1,3.48,13.06Z"></path><path fill="#444" d="M6.65,13.06A.64.64,0,0,1,6,12.42v-9a.64.64,0,1,1,1.27,0v9A.64.64,0,0,1,6.65,13.06Z"></path><path fill="#444" d="M12.36,12.79a.64.64,0,0,1-.6-.42L8.69,3.91a.64.64,0,0,1,1.2-.44L13,11.93a.64.64,0,0,1-.38.82A.54.54,0,0,1,12.36,12.79Z"></path></svg>');

    editor.ui.registry.addButton('tinymcedampicker', {
        text: 'DAM',
        icon: 'library-icon',
        tooltip: tooltipPlaceholder,
        onAction: function () {
            editor.fire("blur");
            dialog = openDialog();
            dialog.setData(selectedImageData);
            if (selectedImageData.src == '') {
                openWindow();
            }
        },
        onSetup: function (buttonApi) {
            updateButton(buttonApi);

            function nodeChange() {
                updateButton(buttonApi);
            }

            editor.on("NodeChange", nodeChange);

            return function () {
                editor.off("NodeChange", nodeChange);
            };
        }
    });

    return {
        getMetadata: function () {
            return {
                name: "Image tools (Optimizely DAM)",
                url: "https://www.optimizely.com"
            };
        }
    };
})