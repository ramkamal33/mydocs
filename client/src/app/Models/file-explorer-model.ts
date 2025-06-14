export class filesDaata {
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

  export class Batchupdate{
    public userid: string | undefined;
    public filenames: string[] | undefined ;
    public newvalue: string | undefined ;
    public colnam:string | undefined;
    Batchupdate() {
      this.filenames = [];
      this.newvalue = "";
      this.userid = "";
      this.colnam = "";
    } 
  }