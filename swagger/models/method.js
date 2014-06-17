exports.method = {
  "Mehtod": {
    "id": "Method",
    "required": ['name'],
    "properties": {
      "name": {
        "type": "string"
      },
      "body": {
        "type": "string"
      },
      "params": {
        "type": "array",
        "items": {
          "type": "string"
        }
      }
    }
  }
}