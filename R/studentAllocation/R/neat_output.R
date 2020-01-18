
#' Create a neat (tibble) version of the lecturer allocation
#'
#' @param allocation_output Output object from the allocation algorithm
#'
#' @return
#' @export
#' @importFrom dplyr mutate tibble `%>%`
#'
#' @examples
neat_lecturer_output <- function( allocation_output ){
  
  lapply(
    names(allocation_output$lecturer_assignments),
    function(lect){
      students = allocation_output$lecturer_assignments[[lect]]
      dplyr::tibble(
        lecturer = lect,
        n_students = length(students),
        student_list = paste(students, collapse = ","),
        at_capacity = lect %in% allocation_output$full_lecturers
      )
    }) %>% do.call(args = ., what = rbind) %>%
    dplyr::mutate( student_list = as.character(student_list) ) -> lecturer_assignments
  
  return(lecturer_assignments)

}


#' Create a neat (tibble) version of the project allocation
#'
#' @param allocation_output Output object from the allocation algorithm
#'
#' @return
#' @export
#' @importFrom dplyr mutate tibble `%>%`
#'
#' @examples
neat_project_output <- function( allocation_output ){
  
  lapply(
    names(allocation_output$project_assignments),
    function(proj){
      students = allocation_output$project_assignments[[proj]]
      tibble(
        project = proj,
        lecturer = allocation_output$project_list[[proj]]$lecturer,
        n_students = length(students),
        student_list = paste(students, collapse = ","),
        at_capacity = proj %in% allocation_output$full_projects
      )
    }) %>% do.call(args = ., what = rbind) %>%
    as_tibble() %>%
    mutate( student_list = as.character(student_list) ) -> project_assignments
  
  return(project_assignments)
  
}

#' Create a neat (tibble) version of the student allocation
#'
#' @param allocation_output Output object from the allocation algorithm
#'
#' @return
#' @export
#' @importFrom dplyr mutate tibble `%>%`
#'
#' @examples
neat_student_output <- function( allocation_output ){
  
  rankings <- sapply(names(allocation_output$student_assignments), function( student ){
    p <- allocation_output$student_assignments[[ student ]]
    match( p, stud_list[[ student ]],  nomatch =  NA )
  })
  
  ## Which lecturer offers which project?
  proj_lects <- sapply( allocation_output$project_list, function(p){
    p[["lecturer"]]
  })
  
  tibble(student = names(allocation_output$student_assignments), 
         project = unlist(allocation_output$student_assignments),
         lecturer = proj_lects [ project ],
         student_ranking = rankings) %>%
    arrange(project) -> student_assignments
  
  return(student_assignments)
  
}