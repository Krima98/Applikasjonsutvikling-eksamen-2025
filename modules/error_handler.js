export function errorHandler(error) {

    const dialog = document.createElement("dialog");
    dialog.classList.add("error-dialog");

    dialog.innerHTML = style + `
        <h3>${error}</h3>
    `;
    document.body.appendChild(dialog);
    dialog.show();

    setTimeout(() => {
        dialog.remove();
    }, 3000);
}

//--------------------------------------------------------------
const style = `
    <style>
        .error-dialog {
            width: 300px;
            border: none;
            border-radius: 20px;
            background-color: rgba(255, 205, 205, 1);
            position: fixed;
            left: 50%;
            text-align: center;
            animation: error 3s ease 0s;
        }

        .error-dialog:focus {
            border: none;
            outline: none;
        }

        @keyframes error {

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