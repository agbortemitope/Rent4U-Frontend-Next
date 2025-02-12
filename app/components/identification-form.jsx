"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Select } from "../components/ui/select"
import { Button } from "../components/ui/button"

const identificationOptions = [
	{ value: "national_id", label: "National ID" },
	{ value: "drivers_license", label: "Driver's License" },
	{ value: "passport", label: "International Passport" },
	{ value: "voters_card", label: "Voter's Card" },
]

export function IdentificationForm({ setIdentificationMethod }) {
	const router = useRouter()
	const [selectedId, setSelectedId] = useState(null)
	const [error, setError] = useState("")

	const handleContinue = () => {
		if (!selectedId) {
			setError("Please select a means of identification")
			return
		}

		setIdentificationMethod(true)
		// TODO: Handle form submission
		console.log("Selected ID:", selectedId)
	}

	const handleSkip = () => {
		// TODO: Handle skip action
		router.push("/") // Navigate to dashboard or next step
	}

	return (
		<div className="w-full max-w-md space-y-6">
			<div className="space-y-2 ">
				<Select
					placeholder="Means of Identification"
					options={identificationOptions}
					value={selectedId?.label}
					onChange={setSelectedId}
					error={!!error}
				/>
				{error && <p className="text-sm text-red-500">{error}</p>}
			</div>

			<div className="space-y-4">
				<Button onClick={handleContinue}>Continue</Button>
				<Button variant="secondary" onClick={handleSkip}>
					Skip
				</Button>
			</div>
		</div>
	)
}

