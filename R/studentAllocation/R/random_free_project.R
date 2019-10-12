free_projects <- function( env ){
  projects_with_full_lecturers <- unlist( 
    sapply(env$full_lecturers, function(el){
      env$lecturer_projects[[ el ]]
    }))
  free_projects <- dplyr::setdiff( 
    names(env$project_list), c(env$full_projects, projects_with_full_lecturers ) 
  )
  return(free_projects)
}

random_free_project <- function( env ){

  free_projects = free_projects( env )

  if( length(free_projects)==0 ){
    return(NULL)
  }else{ 
    return( sample( free_projects, size = 1) )
  }
}


  
