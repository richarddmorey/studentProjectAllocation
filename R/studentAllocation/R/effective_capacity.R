

#' Compute the effective capacity of lecturers
#'
#' @param lecturer_list A list of lecturer preferences, in the format output by `read_lecturer_file`
#' @param project_list A list of project definitions, in the format output by `read_project_file`
#'
#' @return
#' @export
#'
#' @examples
effective_capacity <- function(lecturer_list, project_list){
  lect_cap = sapply(lecturer_list, function(el) el$cap)
  proj_lect_cap <- lect_cap * 0
  for(i in 1:length(project_list)){
    proj_lect_cap[project_list[[i]]$lecturer] = 
      proj_lect_cap[project_list[[i]]$lecturer] + 
      project_list[[i]]$cap
  }
  effective_cap = pmin(lect_cap, proj_lect_cap)
  return(effective_cap)
}
