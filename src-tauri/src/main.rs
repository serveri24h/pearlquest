extern crate serde_json;
extern crate serde;
#[macro_use] extern crate serde_derive;
use std::{error::Error, fs::File, io::Write};

const PATH: &str = "test.csv";

#[derive(Serialize, Deserialize)]
struct Data {
    N_total: u16,
    N_colored_1: u16,
    N_colored_2: u16,
    correct_bag: Vec<u16>,
    selected_bag: Vec<u16>,
    data: Vec<String>
}


impl Data {
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
fn datadump(data: Data) {
    match write_data(data){
        Ok(())=>{},
        Err(error) => panic!("Somethin failed: {:?}", error),
    };
}

fn write_data(data: Data) -> Result<(), Box<dyn Error>> {
    let data_str = data.get_data_as_string();
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
    
    let data_str = data.get_data_as_string();
    
    match write!(outf, "{}", data_str){
        Ok(())=>{},
        Err(error) => panic!("Somethin failed with appending to csv-file: {:?}", error),
    };
    Ok(())
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![datadump])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
