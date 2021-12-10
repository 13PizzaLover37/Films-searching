window.onload = function(){
    showsApp.init();
}

let showsApp = {
    data: null,
    searchInput: null,
    searchButton: null,
    resultSearchInput: null,
    showsDataSection: null,
    init: function(){
        this.searchInput = document.querySelector(".section-input-search");

        this.searchInput.addEventListener("keyup", (e) => {
            if(e.keyCode == 13 ){
                this.resultSearchInput = this.searchInput.value;
                this.loadData(this.resultSearchInput);
            }
        });

        this.searchButton = document.querySelector(".section-input-button");
        this.searchButton.addEventListener("click", () => {
            // one more time this.searchInput, because without it we can't get value;
            this.searchInput = document.querySelector(".section-input-search");
            this.resultSearchInput = this.searchInput.value;
            console.log(this.resultSearchInput);
            this.loadData(this.resultSearchInput);    
        });
        this.showsDataSection = document.querySelector(".show-data-section");
     
    },

    loadData: function(result){
        fetch("https://api.tvmaze.com/search/shows?q=" + result.trim())
            .then(response => response.json())
            .then(data => this.dataResponse(data));   
    },

    dataResponse: function(showData){
        this.data = showData;


        let allBoxesHtml = "";

        for(let i=0; i< showData.length; i++){
            let show = showData[i];
            show = show.show;
            let score = show.score;

            let genres = null;
            if(show.genres.length > 0){
                genres = show.genres.join(", ");
            } else {
                genres = "Niewiadomo =)";
            }

            let imgUrl = null;
            let imgUrlOriginal = null;

            if(show.image){
                imgUrl = show.image.medium;
                imgUrlOriginal = show.image.original;
            } else {
                imgUrl = "https://cdn.pixabay.com/photo/2013/07/12/17/47/test-pattern-152459__340.png";
                imgUrlOriginal = "https://cdn.pixabay.com/photo/2013/07/12/17/47/test-pattern-152459__340.png";
                
            }

            let showTitle = null;
            if(!show.name) continue;
            showTitle = show.name;

            let network = "-";
            if (show.network) network = show.network.name; 

            let officialSite = "-";
            if (show.officialSite) officialSite = show.officialSite;

            let premiered = "-";
            if(show.premiered) premiered = show.premiered;

            let summary = `
                <p>Show: ${showTitle}</p>
                <p>Network: ${network}</p>
                <p>Official Site: ${officialSite}</p>
                <br>
            ` + show.summary ;

            allBoxesHtml += this.getShowsByTemplate(imgUrl, showTitle, genres, summary);
        };

        this.showsDataSection.innerHTML = allBoxesHtml;

    },

    getShowsByTemplate: function(imgUrl, title, genres, overview){
        return `
            <div class="show-box">
                <img src="${imgUrl}" alt="" class="show-box-img">
                <div class="show-title">${title}</div>
                <div class="show-genres">${genres}</div>
                <div class="show-overview">${overview}</div>
            </div>
        `
    }

}