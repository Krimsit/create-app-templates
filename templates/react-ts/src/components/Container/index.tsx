import * as React from "react"

import { ContainerStyle } from "../../styles"

const Container: React.FC<{ children: React.ReactChild }> = ({ children }): JSX.Element => {
    return <ContainerStyle>{children}</ContainerStyle>
}

export default Container
