document.addEventListener("DOMContentLoaded", function () {

    async function init() {



        let Allworks = await FetchWorks();
        this.Allworks = Allworks;

        let Allcategory = await FetchCategory();

        displaygallery(Allworks);
        displayfilters(Allcategory);

        const FiltresAll = document.querySelectorAll(".filtres ul li button");

        FiltresAll.forEach(filtre => {
            filtre.addEventListener("click", (e) => worksfiltred(e));
        });


    }

    init();

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
    function displayfilters(Allcategory) {

        let filter = document.querySelector(".filtres ul");

        for (const categorys of Allcategory) {
            filter.insertAdjacentHTML(
                "beforeend",
                `
                <li><button id="${categorys.id}">${categorys.name}</button></li>
                `
            )
        }
    }


    function worksfiltred(filtre) {
        let categoriesworks = [];
        const gallery = document.querySelector(".gallery");
        if (filtre.target.id == 0) {
            gallery.innerHTML = '';
            displaygallery(Allworks);
        } else {
            categoriesworks = Allworks.filter((work) => filtre.target.id == work.categoryId);
            gallery.innerHTML = '';
            displaygallery(categoriesworks);
        }
    }
})