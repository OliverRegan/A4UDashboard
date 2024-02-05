import { cloneElement } from "react"

const PageHeader = ({ title, dropdownContent }) => {



    return (
        <div className="page-header-container flex justify-between">
            <h2 className="page-header">
                {title}
            </h2>
            {
                dropdownContent
            }
        </div>

    )
}

export default PageHeader