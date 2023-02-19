extern crate serde_json;
extern crate serde;
#[macro_use] extern crate serde_derive;
use std::{error::Error, fs, fs::File, io::Write};
use serde::{Serialize, Deserialize};

const PATH: &str = "tasty.csv";

#[derive(Serialize, Deserialize)] 
struct ExportData {
    N_total: u16,
    N_colored_1: u16,
    N_colored_2: u16,
    correct_bag: Vec<u16>,
    selected_bag: Vec<u16>,
    data: Vec<String>
}


impl ExportData {
    fn get_data_as_string(&self) -> String {
        let mut buffer = String::from("\n");

        buffer +=  &self.N_total.to_string();  
        buffer += ",";
        buffer += &self.N_colored_1.to_string();
        buffer += ",";
        buffer += &self.N_colored_2.to_string();
        buffer += ","; 


        for x in &self.correct_bag {
            buffer += &x.to_string();
        }

        buffer += ",";

        for x in &self.selected_bag {
            buffer += &x.to_string();
        }
        
        buffer += ",";
        for d in &self.data {
            buffer += &d;
            buffer += " ";
        }
        buffer
    }

}



#[tauri::command]
fn datadump(exportdata: ExportData) -> () { 
    match write_data(exportdata){
        Ok(())=>{},
        Err(error) => panic!("Somethin failed: {:?}", error),
    };
    ()
}

// remember to call `.manage(MyState::default())`

#[tauri::command]
fn commandname() -> () {
    println!("JEEEEEEEEEE");
    ()
}

#[tauri::command]
fn getdata() -> serde_json::Value {
    let data = fs::read_to_string("config/config.json").unwrap();
    let v: serde_json::Value = serde_json::from_str(&data).unwrap();
    v
}

fn write_data(exportdata: ExportData) -> Result<(), Box<dyn Error>> {
    //let data_str = exportdata.get_data_as_string();

    let mut outf: File;

    if !std::path::Path::new(PATH).exists() {
        outf = File::create(PATH)?;
        match write!(outf, "N_total,N_colored_1,N_colored_2,correct_bag,selected_bag,data"){
            Ok(())=>{},
            Err(error) => panic!("Somethin failed with creating the csv-file: {:?}", error),
        };
    }
    else {
        outf = File::options().append(true).open(PATH)?;
    }
    
    let data_str = exportdata.get_data_as_string();
    
    match write!(outf, "{}", data_str){
        Ok(())=>{},
        Err(error) => panic!("Somethin failed with appending to csv-file: {:?}", error),
    };
    Ok(())
}

fn main() {
    tauri::Builder::default()
        //.invoke_handler(tauri::generate_handler![commandname])
        //.invoke_handler(tauri::generate_handler![datadump])
        .invoke_handler(tauri::generate_handler![getdata, datadump])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
