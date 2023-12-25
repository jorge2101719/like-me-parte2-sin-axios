export const handleErrors = (code) => {
    switch (code) {
        case "22P02":
            return {
                status: 400,
                message: 'Formato no válido en el parámetro',
            };
        case "23502":
            return {
                status: 400,
                message: 'Falta información en el QUERY STRING/CAMPO de la tabla'
            }
        case "400":
            return {
                status: 400,
                message: 'Faltan datos en la petición'
            };
        case "404":
            return {
                status: 404,
                message: 'No existe ese registro en la tabla'
            };
        default:
            return {
                status: 400,
                message: 'Error de servidor'
            };
    }
}