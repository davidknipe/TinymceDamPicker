tinyMCE.PluginManager.add("tinymcedampicker", (editor, url) => {

    var tooltipPlaceholder = "Optimizely DAM selector";
    var dialog;
    var dialogOpen = false;
    var selectedImageData = {
        src: '',
        alt: '',
        dimensions: {
            width: '',
            height: ''
        },
        padding: '',
        float: ''
    };

    var getUiUrl = function () {
        var uiBaseUrl = window.location.protocol;
        uiBaseUrl += "//";
        uiBaseUrl += window.location.host;
        uiBaseUrl += "/";
        var uiSegment = window.location.pathname.split("/")[1];
        uiBaseUrl += uiSegment;

        return uiBaseUrl;
    }

    var getRequestVerificationToken = function () {
        const root = document.getElementById("epi-navigation-root");
        const antiforgeryFormFieldName = root?.dataset.epiAntiforgeryFormFieldName?.toString();
        const token = document.getElementsByName(antiforgeryFormFieldName);
        return token[0].value;
    }

    var openDialog = function () {
        dialogOpen = true;
        return editor.windowManager.open({
            title: 'Optimizely DAM Image Selector',
            body: {
                type: 'tabpanel',
                tabs: [
                    {
                        name: 'General',
                        title: 'General',
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
                    {
                        name: 'Advanced',
                        title: 'Advanced',
                        items: [
                            {
                                type: 'grid',
                                columns: 2,
                                items: [
                                    {
                                        type: 'input',
                                        label: 'Padding (pixels)',
                                        name: 'padding',
                                        inputMode: 'numeric'
                                    },
                                    {
                                        type: 'listbox',
                                        name: 'float',
                                        label: 'Float image',
                                        items: [
                                            { text: 'Select...', value: '' },
                                            { text: 'Left', value: 'left' },
                                            { text: 'Right', value: 'right' }
                                        ]
                                    }
                                ]
                            }
                        ]
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
                var styleElement = '';
                var padding = parseInt(data.padding)
                if (padding) {
                    styleElement += 'padding: ' + data.padding + 'px; ';
                }
                if (data.float !== '') {
                    styleElement += 'float: ' + data.float + '; ';
                }
                if (styleElement !== '') {
                    styleElement = ' style="' + styleElement + '"'
                }

                if (data.src.indexOf("/") == 0) {
                    // Updating content that already had an internal reference
                    api.close();
                    delete dialog;
                    dialogOpen = false;

                    var imgHtml = '<img ' + styleElement + ' width="' + data.dimensions.width + '" height="' + data.dimensions.height + '" src="' + data.src + '" alt="' + data.alt + '"></img>';
                    editor.insertContent(imgHtml);
                    editor.focus();
                    setTimeout(() => {
                        editor.fire("change");
                    }, 100);

                    return;
                }

                var urlTarget = getUiUrl() + "/EPiServer.Cms.WelcomeIntegration.UI/Stores/episervercmsdamcontentcreation/";
                fetch(urlTarget, {
                    method: "POST",
                    body: JSON.stringify({
                        "externalUrl": data.src,
                        "title": data.alt,
                        "assetType": 0
                    }),
                    headers: {
                        "Accept": "application/javascript, application/json",
                        "Content-type": "application/json",
                        "Requestverificationtoken": getRequestVerificationToken(),
                        "X-Epicontentlanguage": "en",
                        "X-Epicurrentcontentcontext": "0",
                        "X-Requested-With": "XMLHttpRequest"
                    }
                })
                    .then((response) => response.json())
                    .then((json) => {
                        var url = json.permanentLink.replace("~", "");
                        api.close();
                        delete dialog;
                        dialogOpen = false;

                        editor.insertContent('<img ' + styleElement + ' width="' + data.dimensions.width + '" height="' + data.dimensions.height + '" src="' + url + '" alt="' + data.alt + '"></img>');
                        editor.focus();
                        setTimeout(() => {
                            editor.fire("change");
                        }, 100);
                    });
            }
        });
    };

    const handleChoose = (event) => {
        const imageData = event.data[0];
        if (imageData) {
            if (dialogOpen == false) {
                dialog = openDialog();
            }
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
        selectedImageData.float = '';
        selectedImageData.padding = '';

        if (selectedElement && selectedElement.tagName === "IMG" && editor.dom.getAttrib(selectedElement, "class").indexOf("libItem") === -1) {

            selectedImageData.src = editor.dom.getAttrib(selectedElement, "src");
            selectedImageData.alt = editor.dom.getAttrib(selectedElement, "alt");
            selectedImageData.dimensions.height = editor.dom.getAttrib(selectedElement, "height");
            selectedImageData.dimensions.width = editor.dom.getAttrib(selectedElement, "width");

            var paddingVal = selectedElement.style.padding;
            if (paddingVal && paddingVal !== '') {
                selectedImageData.padding = paddingVal.replace("px", "");
            }
            var floatVal = selectedElement.style.float;
            if (floatVal && floatVal !== '') {
                selectedImageData.float = floatVal;
            }

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
            if (selectedImageData.src == '') {
                openWindow();
            }
            else {
                dialog = openDialog();
                dialog.setData(selectedImageData);
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
