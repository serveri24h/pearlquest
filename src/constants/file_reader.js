// frontend code
const { invoke } = window.__TAURI__.tauri

export async function read_data() {
    return invoke('getdata').then((response) => {
        return response;
    })
}