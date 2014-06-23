exports.user = {
  "User": {
    "id": "User",
    "required": ['name', 'email', 'username', 'password'],
    "properties": {
      "name": {
        "type": "string"
      },
      "email": {
        "type": "string"
      },
      "username": {
        "type": "string"
      },
      "provider": {
        "type": "string"
      },
      "password": {
        "type": "string"
      }
    }
  }
}