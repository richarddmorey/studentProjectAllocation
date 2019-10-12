lecturer_projects <- function( project_list ){
  
  lecturers <- sapply( project_list, function(el){
    el[[ "lecturer" ]]  
  })
  
  tapply( names(lecturers), lecturers, c )
  
}