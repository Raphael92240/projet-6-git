document.addEventListener("DOMContentLoaded", function () {
    const form = {
        email: document.querySelector("#maillogin"),
        password: document.querySelector("#mdplogin"),
        submit: document.querySelector("#btn-connexion"),
        messages: document.getElementById("#MSGerror"),
    };



    let submited = form.submit.addEventListener("click", (e) => {
        e.preventDefault();
        console.log(form.email.value);
        console.log(form.password.value);


        fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: form.email.value,
                password: form.password.value,
            }),
        })
            .then(async response => {
                let data = await response.json()

                if (response.status === 200) {
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("userId", data.userId);
                    document.location.href = "../pages/admin.html";
                } else {
                    let errorMsg = document.getElementById('MSGerror');
                    errorMsg.textContent = "Erreur dans l’identifiant ou le mot de passe";
                }
            })
            .catch(error => {
                console.error(error);
                errorMsg.textContent = "Erreur dans la requête";
            });
    });






})