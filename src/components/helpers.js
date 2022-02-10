import { Alert } from "react-bootstrap"

export const displayAlert = (variant, text, link, linkText) => {
    return(
        <Alert variant={variant}>
            {text}
            <Alert.Link href={link}>{linkText}</Alert.Link>
        </Alert>
    )
}