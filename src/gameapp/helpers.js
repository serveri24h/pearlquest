const { invoke } = window.__TAURI__.tauri;




export function range(start, end) {
    return Array(end - start).fill().map((_, idx) => start + idx)
}

function get_timestamp(){
    const d = new Date
    var time_stamp = d.getDate()+'/'+d.getMonth()+'/'+d.getFullYear()
                                +'-'+d.getHours()+':'+d.getMinutes()+',';
    return time_stamp;
}

export async function datadump(data_dict){
    await invoke("datadump", { data: data_dict });
}

export function sum_of_list(l){
    let s = 0;
    for (let i = 0; i<l.length; i++){
        s+=l[i];
    }
    return s;
}

export function pick_random_idx(n_range){
    return Math.floor(Math.random()*n_range);
}