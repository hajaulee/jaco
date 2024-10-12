if (document.getElementById("extensionPopup")){
    const dialog = document.getElementById("extensionPopup");
    if (dialog.open){
        dialog.close();
    } else {
        dialog.showModal();
    }
} else {
    const dialogContent = `<dialog id="extensionPopup" style="margin-left: 50%; margin-top: 50%;transform: translate(-50%, -50%);border-radius: 0.5rem;border: 1px solid #adadad;">
    <iframe src="` + chrome.runtime.getURL("popup.html") +  `" style="border: none;"></iframe>
    </dialog>`;

    const div = document.createElement('div');
    div.innerHTML = dialogContent;
    document.body.appendChild(div);
    setTimeout(() => {
        const dialog = document.getElementById("extensionPopup");
        dialog.showModal();

        // Close when click outside
        window.addEventListener('click', (event) => {
            if (event.target == dialog){
                dialog.close();
            }
        });
    }, 100);

}