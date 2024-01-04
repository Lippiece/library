const { location: location_ } = window
const { href: href_ }         = location_

!href_.includes("fetch") && location_.replace(`${href_}?fetch=true`)
