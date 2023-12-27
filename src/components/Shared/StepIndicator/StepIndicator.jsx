import { useEffect, useState } from "react"


const StepIndicator = (props) => {

    const [stepArray, setStepArray] = useState([])

    useEffect(() => {
        console.log(props)
        let tempArr = [];

        for (let i = 0; i < props.stepList.length; i++) {

            tempArr.push(createStepHtml(props.stepList[i]))
            setStepArray(tempArr)

        }

    }, [props.step])


    function createStepHtml(step) {

        return (
            <div className={`inline-block col-span-${12 / props.stepList.length}` + (step.step <= (props.completedStep + 1) ? " hover:cursor-pointer" : "")}
                onClick={() => step.step <= (props.completedStep + 1) ? props.setStep(() => step.step) : null}>
                <div className={"flex rounded-xl py-1 px-2 border-solid border-2 " + (step.step === props.step ? "border-blue-600 bg-gray-100 text-blue-500" :
                    step.step <= (props.completedStep + 1) ? "border-blue-200 bg-blue-100 text-gray-500" : "border-gray-200 bg-gray-100 text-gray-500")}>
                    <div className="px-2 py-2">
                        {step.step}
                    </div>
                    <div className="flex flex-col justify-center text-center mx-1 text-sm w-full">
                        <p className="">
                            {step.name}
                        </p>
                    </div>
                </div>
            </div>
        )

    }


    return (
        <div className="w-full grid grid-cols-12">
            {
                stepArray
            }
        </div>
    )

}
export default StepIndicator