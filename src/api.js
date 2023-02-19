const { invoke } = window.__TAURI__.tauri;

export async function read_default_settings() {
    let defaultSettings = await invoke("getdata");
    let nBalls = parseInt(defaultSettings['N_BALLS']);
    let nColoredBalls = parseInt(defaultSettings['N_COLORED_BALLS']);
    let nReplications = parseInt(defaultSettings['N_REPLICATIONS']);
    let ret = {'totalBalls': nBalls, 'coloredBalls': nColoredBalls, 'nReplications': nReplications}
    return ret
}

export async function dumpDump(data_dict){
    console.log(data_dict)
    await invoke("datadump", {exportdata: data_dict})
    //let a = await invoke("datadump", { data: data_dict });
}