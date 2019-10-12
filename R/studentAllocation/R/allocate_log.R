

allocate_log <- function(...){
  if(pkg_options()$print_log)
    message("studentAllocation: ", ...)
}