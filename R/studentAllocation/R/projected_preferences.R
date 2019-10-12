


#' Initialize projected preferences and extend lecturer preferences
#'
#' @param student_list list of student preferences
#' @param lecturer_list list of lecturer preferences and caps
#' @param project_list list of projects, lecturers, and caps
#'
#' @return
#' @export
#'
#' @examples
projected_preference_list <- function( student_list, lecturer_list, project_list ){
  
  ## Create projected preference list - first pass; add students not on lecturer's list
  for( student in names(student_list) ){
    projects <- student_list[[ student ]]
    for( project in projects){
      lecturer <- project_list[[ project ]][[ "lecturer" ]]
      lecturer_students <- lecturer_list[[ lecturer ]][[ "students" ]]
      if( !(student %in% lecturer_students) ){
        lecturer_list[[ lecturer ]][[ "students" ]] <- c( lecturer_students, student )
      }
    }
  }
  
  
  projected_preferences <- list()
  
  ## Create projected preference list - second pass; add students to projected list
  for( project in names(project_list) ){
    projected_preferences[[ project ]] <- c()
    lecturer <- project_list[[ project ]][[ "lecturer" ]]
    lecturer_students <- lecturer_list[[ lecturer ]][[ "students" ]]
    for( student in lecturer_students ){
      student_projects <- student_list[[ student ]]
      if( project %in% student_projects )
        projected_preferences[[ project ]] <- c( projected_preferences[[ project ]], student )
    }
  }

  
  
  return(list(
    lecturer_list = lecturer_list,
    projected_preferences = projected_preferences
  ))  
  
}