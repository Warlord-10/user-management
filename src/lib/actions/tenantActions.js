const fetchTenantDetails = async(tenantId) => {
    try {
        const respone = await fetch(process.env.NEXT_PUBLIC_BASE_URL + '/api/tenant/' + tenantId, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        })
        return respone;

    } catch (error) {
        console.log(error)
    }
}

export {fetchTenantDetails}