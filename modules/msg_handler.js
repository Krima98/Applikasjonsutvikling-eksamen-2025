export function showMessage(msg) {

    const dialog = document.createElement("dialog");
    dialog.classList.add("show-msg-dialog")

    dialog.innerHTML = style + `
        <h3>${msg}</h3>
    `
    document.body.appendChild(dialog);
    dialog.show();

    setTimeout(() => {
        dialog.remove();
    }, 3000);
}

//--------------------------------------------------------------
const style = `
    <style>
        .show-msg-dialog {
            width: 300px;
            position: fixed;
            border: none;
            border-radius: 20px;
            left: 50%;
            background-color: rgba(234, 255, 230, 1);
            text-align: center;
            animation: msg 3s ease 0s;
        }

        @keyframes msg {

            0% {
                opacity: 0;
                top: 20%;
                transform: translate(-50%, -50%);
            }
        
            25% {
                opacity: 1;
                top: 15%;
                transform: translate(-50%, -50%);
            }

            75% {
                opacity: 1;
                top: 15%;
                transform: translate(-50%, -50%);          
            }

            100% {
                opacity: 0;
                top: 15%;
                transform: translate(-50%, -50%);
            }
        }

    </style>
`;