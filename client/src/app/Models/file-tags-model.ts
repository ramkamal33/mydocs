export interface filesearchattributesdata {
    username:string;
    fileName:string;
    keywords:string[];
    videourls:string[];
    fileCategory:string;   
  }

  class filesDaata {
    name: string;
    preview: boolean;
    delete: string;
    age: number;
    constructor() {
      this.name = "";
      this.preview = true;
      this.delete = "";
      this.age = 0;
    }
  
  }