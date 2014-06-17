exports.class = {
  "Class": {
    "id": "Class",
    "description": "A javascript class template defined by a user",
    "required": ['name', 'author'],
    "properties": {
      "id": {
        "type": "string"
      },
      "name": {
        "type": "string"
      },
      "author": {
        "type": "User"
      },
      "description": {
        "type": "string"
      },
      "properties": {
        "type": "array",
        "items": {
          "type": "string"
        }
      },
      "methods": {
        "type": "array",
        "items": {
          "$ref": "Method"
        },
        "description": "Methods defined as members of this class"
      },
      "inherits": {
        "type": "Class"
      },
    }
  }
}