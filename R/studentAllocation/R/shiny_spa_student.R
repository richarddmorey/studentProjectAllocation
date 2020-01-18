

#' Run the shiny app for the SPA student algorithm
#'
#' @return
#' @export
#' 
#' @importFrom shiny runApp
#'
#' @examples
shiny_spa_student <- function(){
  shiny::runApp( 
    appDir = system.file("shiny", package = "studentAllocation")
    )
}