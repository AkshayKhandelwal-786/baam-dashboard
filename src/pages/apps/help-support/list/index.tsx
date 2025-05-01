import * as yup from 'yup'
import dynamic from "next/dynamic";
import { useState, useRef, useEffect } from "react";
import { Card, CardBody, Form, Label, Button, Container } from "reactstrap";
import usePageStore, { Page } from 'src/features/about-us/about-us.service'
import { PageService } from 'src/api/AdminApi'; // Import PageService for API calls

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const AboutUs = () => {
    const editor = useRef(null);
    const [content, setContent] = useState('');
    const { get, astrologer } = usePageStore();
    const store = usePageStore();

    useEffect(() => {
        get.list();
    }, []);
    
    useEffect(() => {
        const aboutUsPage = astrologer.list.find(page => page.type === "help-support");
        if (aboutUsPage) {
            setContent(aboutUsPage.content);
        }
    }, [astrologer.list]);


    const config = {
        height: "400px", // Set editor height
        minHeight: "300px", // Minimum height
        maxHeight: "600px", // Maximum height before scrolling
        iframe: false, // Ensure editor uses default layout (important for height)
        style: {
            height: "400px" // Enforce height
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const requestData = {
            type: "help-support",
            content: content
        };

        try {
            const response = await PageService.create({ requestBody: requestData });
            
            if (response?.status) {
                get.list(); // Refresh the list after updating
            } else {
                console.log("Something went wrong!");
            }
        } catch (error) {
            console.log(error || "Something went wrong!");
        }
    };


    return (
        <div className="wrapper">
            <Card className="shadow-sm border-0 mt-2">
                <CardBody>
                    <h3>Help & Support</h3>
                    <Form onSubmit={handleSubmit}>
                        <div className="my-3">
                            <JoditEditor
                                ref={editor}
                                value={content}
                                onChange={newContent => setContent(newContent)}
                            />
                        </div>
                        <br />
                        <Container className="text-center">
                            <Button type="submit" className="rounded-0" color="primary">
                                Update Help & Center
                            </Button>
                        </Container>
                    </Form>
                </CardBody>
            </Card>
        </div>
    );
};

export default AboutUs;
