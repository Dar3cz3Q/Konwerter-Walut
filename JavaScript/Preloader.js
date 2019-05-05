window.addEventListener('load', function () {
	$(".PageLoading").addClass("Preloader-Hidding");
    var preloaderEl = document.querySelector(".PageLoading");
	preloaderEl.addEventListener('transitionend', function () {
		$(".PageLoading").addClass("Preloader-Hidden");
        $(".PageLoading").removeClass("Preloader-Hidding");
	});
});