import * as yup from 'yup'
import dynamic from "next/dynamic";
import { useState, useRef, useEffect } from "react";
import { Card, CardBody, Form, Label, Button, Container } from "reactstrap";
import usePageStore, { Page } from 'src/features/about-us/about-us.service'

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const AboutUs = () => {
    const editor = useRef(null);
    const [content, setContent] = useState('');
    const store = usePageStore();

    console.log("<11<<", store);
    
    const config = {
        height: "400px", // Set editor height
        minHeight: "300px", // Minimum height
        maxHeight: "600px", // Maximum height before scrolling
        iframe: false, // Ensure editor uses default layout (important for height)
        style: {
            height: "400px" // Enforce height
        }
    };

    return (
        <div className="wrapper">
            <Card className="shadow-sm border-0 mt-2">
                <CardBody>
                    <h3>About Us</h3>
                    <Form>
                        <div className="my-3">
                            <JoditEditor
                                ref={editor}
                                value={content}
                                onChange={newContent => setContent(newContent)}
                            />
                        </div>
                        <br></br>
                        <Container className="text-center">
                            <Button type="submit" className="rounded-0" color="primary">Update About Us</Button>
                        </Container>
                    </Form>
                </CardBody>
            </Card>
        </div>
    );
};

export default AboutUs;
