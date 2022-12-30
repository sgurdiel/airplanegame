export async function asyncDelay(milliseconds: number): Promise<boolean> {
    return await new Promise<boolean>(resolve => { 
        setTimeout(() => { resolve(true) }, milliseconds)
    })
}
