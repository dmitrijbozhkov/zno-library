''.join(random.choices(string.ascii_uppercase + string.digits, k=N)) # generate random string
.query.filter(Model.column.ilike("ganye")) # find case insensitive