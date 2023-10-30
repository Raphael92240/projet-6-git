document.addEventListener("DOMContentLoaded", function () {

    async function init() {

        TestConnected();
        eventAdmin();

        let Allworks = await FetchWorks();
        this.Allworks = Allworks;

        let Allcategory = await FetchCategory();
        this.Allcategory = Allcategory;

        displaygallery(Allworks);
    }

    init();

    function TestConnected() {
        let token = localStorage.getItem("token");
        if (!token) {
            window.location.href = "../index.html";
        }
    }

    function FetchWorks() {
        return fetch('http://localhost:5678/api/works')
            .then(Response => {
                return Response.json();
            })
            .catch(error => {
                console.log(error);
            })
    }

    function FetchCategory() {
        return fetch('http://localhost:5678/api/categories')
            .then(Response => {
                return Response.json();
            })
            .catch(error => {
                console.log(error);
            })
    }




    function displaygallery(Allworks) {

        let gallery = document.querySelector(".gallery");
        gallery.innerHTML = '';
        for (const work of Allworks) {
            gallery.insertAdjacentHTML(
                "beforeend",
                `
                <figure>
                    <img src="${work.imageUrl}" alt="${work.title}">
                    <figcaption>${work.title}</figcaption>
                </figure>
                `
            )

        }
    }
    function SelectCategory(Allcategory) {

        let categorieselected = document.querySelector(".categorieselect");

        for (const category of Allcategory) {
            categorieselected.insertAdjacentHTML(
                "beforeend",
                `
                <option value="${category.id}">${category.name}</option>

                `
            )

        }
    }

    function eventAdmin() {

        let logout = document.getElementById("logout");

        let modal = document.getElementById("myModal");
        let btn = document.getElementById("btn-modal");

        logout.addEventListener("click", function (e) {
            localStorage.clear();
            window.location.href = "../index.html";
        })

        btn.addEventListener("click", function (e) {
            modal.style.display = "flex";
            backbutton();

        })

        window.addEventListener("click", function (e) {
            if (e.target == modal) {
                backbutton();
                modal.style.display = "none";
            }
        })
    }

    function addnewwork() {
        let modal = document.getElementById("myModal");
        modal.innerHTML = '';
        modal.insertAdjacentHTML(
            "beforeend",
            `
            <div id="myModal2">
                <div class="modal-content">
                    <div class="modal-header modal-header-add">
                        <button id="retourstep1"><i class="fa-solid fa-arrow-left"></i></button>
                        <span class="close">&times;</span>
                    </div>
                    <h2 id="h2addwork">Ajout photo</h2>
                    <div id="modal-form" class="modal-body">
                        <div class="uploadImage">
                            <input type="file" accept="image/png, image/jpeg" id="ImageSend" />
                            <div id="output">
                                <i class="fa-regular fa-image"></i>
                                <button>
                                    <i class="fa-solid fa-plus"></i> Ajouter une photo
                                </button>
                                <p>jpg, png : 4mo max</p>
                            </div>
                        </div>
                        <form class="add" action="#" method="newpost">
                            <label for="titre">Titre</label>
                            <input type="text" name="titre" id="titre" >
                            <label for="categorie">Catégorie</label>
                            <select class="categorieselect" name="categorie" id="categorie" >
                                <option value=""></option>
                            </select>
                            <div class="separator"></div>
                            <input type="submit" value="Valider" id="AddWork" />
                            <p id="errormodal"></p>
                        </form>
                    </div>
                </div>
            </div>
            `
        )
        SelectCategory(Allcategory);

        let btnsendmodaladd = document.getElementById("AddWork");

        document.querySelector("#ImageSend").addEventListener("change", function (e) {
            loadFile(e)
        })

        btnsendmodaladd.addEventListener("click", async (e) => {
            e.preventDefault();

            let image = document.querySelector("#ImageSend").files[0];
            let title = document.querySelector("#titre").value;
            let categorie = document.querySelector("#categorie").value;

            let token = window.localStorage.getItem("token");

            if (!image || !title || !categorie) {
                document.getElementById("errormodal").innerText = "Veuillez renseigner les bonnes valeurs";
                return false;
            }

            let formData = new FormData();
            formData.append("image", image);
            formData.append("title", title);
            formData.append("category", categorie);

            const response = await fetch("http://localhost:5678/api/works", {
                method: "POST",
                body: formData,
                headers: {
                    accept: "application/json",
                    Authorization: "Bearer " + token,
                },
            })
            console.log(response)
            if (response.status === 201) {
                let modal = document.getElementById("myModal");
                modal.style.display = "none";
                init()
            }

        });

        closebutton();
        let modalback = document.getElementById("retourstep1");
        modalback.addEventListener("click", () => backbutton())


    }

    const loadFile = function (event) {
        document.querySelector(".uploadImage").classList.add("previewImage");

        document.querySelector("#output").innerHTML = "<img src='" + URL.createObjectURL(event.target.files[0]) + "' alt='image' width='100%'>";

    };

    function closebutton() {
        let modal = document.getElementById("myModal");
        let span = document.getElementsByClassName("close")[0];
        span.addEventListener("click", function (e) {
            modal.style.display = "none";
        })
    }

    function backbutton() {
        let modal = document.getElementById("myModal");
        modal.innerHTML = '';
        modal.insertAdjacentHTML(
            "beforeend",
            `
                <div class="modal-content">
					<div class="modal-header">
						<span class="close">&times;</span>
						<h2>Galerie photo</h2>
					</div>
					<div class="modal-body">
					</div>
                    <div class="separator"></div>
					<div class="modal-footer">
						<button id="add-modal">Ajouter une photo</button>
						<button id="delete-modal">Supprimer la galerie</button>
					</div>
				</div>
                `
        )
        displaygallerymodal(Allworks);


        closebutton();

        let modaladd = document.getElementById("add-modal");
        modaladd.addEventListener("click", () => addnewwork())

        deletework()
    }

    function displaygallerymodal(Allworks) {

        let gallerymodal = document.querySelector(".modal-body");
        gallerymodal.innerHTML = '';
        for (const work of Allworks) {
            gallerymodal.insertAdjacentHTML(
                "beforeend",
                `
                <figure>
                    <img src="${work.imageUrl}" alt="${work.title}">
                    <figcaption>éditer</figcaption>
                    <span><i class="fa-regular fa-trash-can trash" id="${work.id}"></i></span>
                </figure>
                `
            )

        }
    }

    function deletework() {
        let allspanfigure = document.querySelectorAll(".trash");

        allspanfigure.forEach(trashspan => {
            trashspan.addEventListener("click", async (event) => {
                console.log("connard");
                let idtrash = event.target.id;
                let token = window.localStorage.getItem("token");

                const response = await fetch("http://localhost:5678/api/works/" + idtrash, {
                    method: "DELETE",
                    headers: {
                        accept: "application/json",
                        Authorization: "Bearer " + token,
                    },
                })

                if (response.status === 204) {
                    let modal = document.getElementById("myModal");
                    modal.style.display = "none";
                    console.log("204 passez");
                    FetchWorks();
                    let Allworks = await FetchWorks();
                    this.Allworks = Allworks;
                    displaygallerymodal(Allworks);
                    displaygallery(Allworks);
                }
            });
        });
    }

})