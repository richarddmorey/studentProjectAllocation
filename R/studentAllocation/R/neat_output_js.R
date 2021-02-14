
#' Create a neat (tibble) version of the lecturer allocation
#'
#' @param allocation_output Output object from the allocation algorithm
#' @param delim Character used to paste together multiple elements in a field in neat output
#'
#' @return
#' @export
#' @importFrom dplyr filter group_by summarise first `%>%`
#'
#' @examples
neat_lecturer_output_js <- function( allocation_output, delim = pkg_options()$neat_delim ){
  
  allocation_output$allocation %>%
    filter(!is.na(student)) %>%
    filter(!is.na(project)) %>%
    group_by(lecturer) %>%
    summarise(
      cap = first(lCap),
      n_students = sum(!is.na(student)),
      project_list = paste(unique(project), collapse = delim),
      student_list = paste(student, collapse = delim)) %>%
    mutate(
      at_capacity = n_students >= cap
    ) -> lecturer_assignments
  
  return(lecturer_assignments)

}


#' Create a neat (tibble) version of the project allocation
#'
#' @param allocation_output Output object from the allocation algorithm
#' @param delim Character used to paste together multiple elements in a field in neat output
#'
#' @return
#' @export
#' @importFrom dplyr filter group_by summarise first `%>%`
#'
#' @examples
neat_project_output_js <- function( allocation_output, delim = pkg_options()$neat_delim ){
  
  allocation_output$allocation %>%
    filter(!is.na(student)) %>%
    filter(!is.na(project)) %>%
    group_by(project) %>%
    summarise(
      lecturer = first(lecturer),
      cap = first(pCap),
      n_students = sum(!is.na(student)),
      student_list = paste(student, collapse = delim)) %>%
  mutate(
      at_capacity = n_students >= cap
    ) -> project_assignments
  
  return(project_assignments)
  
}

#' Create a neat (tibble) version of the student allocation
#'
#' @param allocation_output Output object from the allocation algorithm
#' @param student_list A list of student preferences, in the format output by `read_student_file`
#'
#' @return
#' @export
#' @importFrom dplyr filter group_by mutate `%>%`
#'
#' @examples
neat_student_output_js <- function( allocation_output, student_list ){
  
  allocation_output$allocation %>%
    filter(!is.na(student)) %>%
    group_by(student) %>%
    mutate(
      assigned = !is.na(project),
      student_ranking =  match(x = project,
                    table = student_list[[student]])
    ) -> student_assignments
  
  return(student_assignments)
  
}