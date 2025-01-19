export const regexName = /^[a-zA-ZäöåÄÖÅ0-9\s]+$/

export const regexURL =
  /^(https?:\/\/)?([a-zA-Z0-9_-]+\.)+[a-zA-Z]{2,6}(\/[a-zA-Z0-9_&%$-]*)*$/

export const regexUsername =
  /^[a-zA-Z]+(-[a-zA-Z]+)?\.[a-zA-Z]+(-[a-zA-Z]+)?@proneuron\.fi$/

export const regexFirstname = /^[a-zA-ZäöåÄÖÅ]+(-[a-zA-ZäöåÄÖÅ]+)?$/

export const regexLastname = /^[a-zA-ZäöåÄÖÅ]+(-[a-zA-ZäöåÄÖÅ]+)?$/

export const regexPassword =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!?.,+\-*/=@$#%^&()_{}[\];:´"])[A-Za-z\d!?.,+\-*/=@$#%^&()_{}[\];:´"]{8,}$/
