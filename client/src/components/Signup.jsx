import React, { useState } from "react";

const Signup = () => {
    const serverURL = import.meta.env.VITE_SERVER_BASE_URL;
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
    });

    const [message, setMessage] = useState(null);

    // Handle form input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Function to trigger private key download
    const downloadPrivateKey = (privateKey) => {
        const element = document.createElement("a");
        const file = new Blob([privateKey], { type: "text/plain" });
        element.href = URL.createObjectURL(file);
        element.download = "private_key.pem";
        document.body.appendChild(element);
        element.click();
    };

    // Handle form submission using fetch
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${serverURL}/api/user/create-user`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message);
                downloadPrivateKey(data.private_key); // Auto download private key
                alert("Please save your private key securely. It will not be shown again!");
            } else {
                setMessage(data.error || "Something went wrong, please try again.");
            }
        } catch (error) {
            setMessage("Something went wrong, please try again.");
        }
    };

    return (
        <div>
            <h2>Sign Up</h2>
            {message && <p>{message}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>First Name:</label>
                    <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Last Name:</label>
                    <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
};

export default Signup;
