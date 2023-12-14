class Item {
  constructor(mazeObj, type="dot") {
    this.mazeObj = mazeObj;
    this.type = type;

    // construct item based on its type
    switch(type) {
      case "speed":
        
      // case "dot":

      //   break;
      default:
        throw new Error("invalid item")
    }
  }

  collectItem() {

  }
}