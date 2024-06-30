import React, { useState, useEffect } from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import axiosInstance from '../../utils/axiosInstance';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import Slider from '@mui/material/Slider';
import {
    Box,
    Typography,
    TextField,
    Button,
    Stack,
    Grid,
    Checkbox
} from '@mui/material';

import ImageEditor from '../ImageEditor';

const AgentPreferences = () => {
    const [selectedValue, setSelectedValue] = useState('PDF');
    const [branding, setBranding] = useState({
        name: '',
        photo: ''
    });
    const [content, setContent] = useState('');
    const [preferences, setPreferences] = useState(null);
    const [customization, setCustomization] = useState({
        name: { fontSize: 14, xPos: 50, yPos: 50, enabled: true },
        photo: { width: 100, height: 100, xPos: 50, yPos: 150, enabled: true },
        content: { fontSize: 12, xPos: 50, yPos: 250, enabled: true }
    });

    const [pdfUrl, setPdfUrl] = useState(null);

    useEffect(() => {
        const fetchPreferences = async () => {
            try {
                const email = "preference@gmail.com"; // Replace with actual email
                const response = await axiosInstance.post('/api/get/agentPreferences', { email });
                if (response.data.success) {
                    setPreferences(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching preferences:', error);
            }
        };
        fetchPreferences();
    }, []);

    useEffect(() => {
        if (preferences) {
            const typePreferences = preferences[`${selectedValue.toLowerCase()}_preferences`] || {};
            setBranding({
                name: typePreferences.name || '',
                photo: typePreferences.photoURL || ''
            });
            setContent(typePreferences.content || '');
            setCustomization(typePreferences.customization || {
                name: { fontSize: 14, xPos: 50, yPos: 50, enabled: true },
                photo: { width: 100, height: 100, xPos: 50, yPos: 150, enabled: true },
                content: { fontSize: 12, xPos: 50, yPos: 250, enabled: true }
            });
        }
    }, [selectedValue, preferences]);

    const handleChange = (event) => {
        setSelectedValue(event.target.value);
    };

    const handleBrandingChange = (event) => {
        const { name, value } = event.target;
        setBranding(prevBranding => ({
            ...prevBranding,
            [name]: value
        }));
    };

    const handleContentChange = (event) => {
        setContent(event.target.value);
    };

    const handleCustomizationChange = (field, subField, value) => {
        setCustomization(prevCustomization => ({
            ...prevCustomization,
            [field]: {
                ...prevCustomization[field],
                [subField]: value
            }
        }));
    };

    const handleSavePreferences = async () => {
        try {
            const email = "preference@gmail.com"; // Replace with actual email
            const preferenceData = {
                email,
                type: selectedValue.toLowerCase(),
                name: branding.name,
                photoURL: branding.photo,
                content,
                customization
            };

            if (preferences) {
                const response = await axiosInstance.put('/api/update/agentPreferences', preferenceData);
                if (response.data.success) {
                    setPreferences(prevPreferences => ({
                        ...prevPreferences,
                        [`${selectedValue.toLowerCase()}_preferences`]: preferenceData
                    }));
                }
            } else {
                const response = await axiosInstance.post('/api/create/agentPreferences', preferenceData);
                if (response.data.success) {
                    setPreferences(response.data.data);
                }
            }
        } catch (error) {
            console.error('Error saving preferences:', error);
        }
    };

    const renderSlider = (label, field, subField, min, max, step) => (
        <Box sx={{ my: 2 }}>
            <Typography variant="subtitle1" gutterBottom>{label}</Typography>
            <Slider
                value={customization[field][subField]}
                onChange={(e, newValue) => handleCustomizationChange(field, subField, newValue)}
                aria-labelledby="input-slider"
                min={min}
                max={max}
                step={step}
            />
        </Box>
    );

    const renderCheckbox = (label, field) => (
        <Box sx={{ my: 2 }}>
            <FormControlLabel
                control={
                    <Checkbox
                        checked={customization[field].enabled}
                        onChange={(e) => handleCustomizationChange(field, 'enabled', e.target.checked)}
                    />}
                label={label}
            />
        </Box>
    );

    useEffect(() => {
        if (selectedValue === "PDF" && preferences) {
            const createPDF = async () => {
                try {
                    const pdfDoc = await PDFDocument.create();
                    const page = pdfDoc.addPage();

                    if (customization.name.enabled && branding.name) {
                        page.drawText(branding.name, {
                            x: parseInt(customization.name.xPos),
                            y: parseInt(customization.name.yPos),
                            size: parseInt(customization.name.fontSize),
                            font: await pdfDoc.embedFont(StandardFonts.HelveticaBold),
                            color: rgb(0, 0, 0),
                        });
                    }

                    if (customization.photo.enabled && branding.photo) {
                        const photoBytes = await fetch(branding.photo).then(res => res.arrayBuffer());
                        let photoEmbed;
                        try {
                            photoEmbed = await pdfDoc.embedPng(photoBytes);
                        } catch (error) {
                            photoEmbed = await pdfDoc.embedJpg(photoBytes);
                        }
                        page.drawImage(photoEmbed, {
                            x: parseInt(customization.photo.xPos),
                            y: parseInt(customization.photo.yPos),
                            width: parseInt(customization.photo.width),
                            height: parseInt(customization.photo.height),
                        });
                    }

                    if (customization.content.enabled && content) {
                        page.drawText(content, {
                            x: parseInt(customization.content.xPos),
                            y: parseInt(customization.content.yPos),
                            size: parseInt(customization.content.fontSize),
                            font: await pdfDoc.embedFont(StandardFonts.Helvetica),
                            color: rgb(0, 0, 0),
                        });
                    }

                    const pdfBytes = await pdfDoc.save();
                    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
                    const url = URL.createObjectURL(blob);
                    setPdfUrl(url);
                } catch (error) {
                    console.error('Failed to create PDF:', error);
                    setPdfUrl(null);
                }
            };

            createPDF();
        }
    }, [branding, customization, content, preferences, selectedValue]);

    const renderPDFPreview = () => {
        if (selectedValue !== "PDF") return null;
        return pdfUrl ? <iframe src={pdfUrl} width="100%" height="700px" title="PDF Preview"></iframe> : <Typography>Loading...</Typography>;
    };
    // Code for PDF Personalization
    // const handlePersonalizePDF = async () => {
    //     if (!selectedPDF) {
    //         alert('Please select a PDF file to personalize');
    //         return;
    //     }

    //     const reader = new FileReader();
    //     reader.onload = async (e) => {
    //         const existingPdfBytes = new Uint8Array(e.target.result);
    //         const pdfDoc = await PDFDocument.load(existingPdfBytes);

    //         const newPage = pdfDoc.insertPage(0);
    //         const { width, height } = newPage.getSize();

    //         const centerX = width / 2;
    //         const centerY = height / 2;
    //         const photoSize = 150;
    //         const photoY = centerY + 100;
    //         const nameY = photoY - photoSize / 2 - 20;
    //         const contentY = nameY - 40;

    //         if (branding.photo) {
    //             const photoBytes = await fetch(branding.photo).then(res => res.arrayBuffer());
    //             let photoEmbed;
    //             try {
    //                 photoEmbed = await pdfDoc.embedPng(photoBytes);
    //             } catch (error) {
    //                 try {
    //                     photoEmbed = await pdfDoc.embedJpg(photoBytes);
    //                 } catch (jpegError) {
    //                     console.error("Failed to embed image:", jpegError);
    //                     alert("Failed to embed image. Please ensure it's a valid PNG or JPEG file.");
    //                     return;
    //                 }
    //             }

    //             // Draw the image with circular clipping
    //             newPage.drawImage(photoEmbed, {
    //                 x: centerX - photoSize / 2,
    //                 y: photoY - photoSize / 2,
    //                 width: photoSize,
    //                 height: photoSize,
    //                 clip: {
    //                     type: 'ellipse',
    //                     x: centerX,
    //                     y: photoY,
    //                     xScale: photoSize / 2,
    //                     yScale: photoSize / 2,
    //                 },
    //             });
    //         }

    //         // Draw name
    //         newPage.drawText(`${branding.name}`, {
    //             x: centerX,
    //             y: nameY,
    //             size: 24,
    //             font: await pdfDoc.embedFont(StandardFonts.HelveticaBold),
    //             color: rgb(0, 0, 0),
    //             align: 'center',
    //         });

    //         // Draw content
    //         newPage.drawText(content, {
    //             x: centerX,
    //             y: contentY,
    //             size: 14,
    //             font: await pdfDoc.embedFont(StandardFonts.Helvetica),
    //             color: rgb(0, 0, 0),
    //             maxWidth: width - 100,
    //             lineHeight: 20,
    //             align: 'center',
    //         });

    //         const pdfBytes = await pdfDoc.save();
    //         const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    //         const url = URL.createObjectURL(blob);

    //         const link = document.createElement('a');
    //         link.href = url;
    //         link.download = 'personalized.pdf';
    //         document.body.appendChild(link);
    //         link.click();
    //         document.body.removeChild(link);
    //     };
    //     reader.readAsArrayBuffer(selectedPDF);
    // };


    return (
        <div>
            <FormControl>
                <RadioGroup
                    row
                    aria-labelledby="row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                    value={selectedValue}
                    onChange={handleChange}
                >
                    {/* <FormControlLabel value="Image" control={<Radio />} label="Image" />
                    <FormControlLabel value="Video" control={<Radio />} label="Video" /> */}
                    <FormControlLabel value="PDF" control={<Radio />} label="PDF" />
                </RadioGroup>
            </FormControl>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    {selectedValue === "PDF" &&
                        <Box>
                            <Typography variant="h5" gutterBottom>
                                Personalize {selectedValue}
                            </Typography>
                            <Stack spacing={2}>
                                <TextField
                                    label="Name"
                                    name="name"
                                    value={branding.name}
                                    onChange={handleBrandingChange}
                                    fullWidth
                                />
                                <TextField
                                    label="Photo URL"
                                    name="photo"
                                    value={branding.photo}
                                    onChange={handleBrandingChange}
                                    fullWidth
                                />
                                <TextField
                                    label="Additional Content"
                                    name="content"
                                    value={content}
                                    onChange={handleContentChange}
                                    fullWidth
                                    multiline
                                    rows={4}
                                />
                                {renderCheckbox('Enable Name', 'name')}
                                {renderSlider('Name Font Size', 'name', 'fontSize', 10, 72, 1)}
                                {renderSlider('Name X Position', 'name', 'xPos', 0, 500, 1)}
                                {renderSlider('Name Y Position', 'name', 'yPos', 0, 700, 1)}

                                {renderCheckbox('Enable Photo', 'photo')}
                                {renderSlider('Photo Width', 'photo', 'width', 50, 300, 1)}
                                {renderSlider('Photo Height', 'photo', 'height', 50, 300, 1)}
                                {renderSlider('Photo X Position', 'photo', 'xPos', 0, 500, 1)}
                                {renderSlider('Photo Y Position', 'photo', 'yPos', 0, 700, 1)}

                                {renderCheckbox('Enable Content', 'content')}
                                {renderSlider('Content Font Size', 'content', 'fontSize', 10, 72, 1)}
                                {renderSlider('Content X Position', 'content', 'xPos', 0, 500, 1)}
                                {renderSlider('Content Y Position', 'content', 'yPos', 0, 700, 1)}

                                <Button variant="contained" onClick={handleSavePreferences}>
                                    Save Preferences
                                </Button>
                            </Stack>
                        </Box>
                    }
                    {selectedValue==="Image" && <ImageEditor/>}
                    {selectedValue==="Video" && <></>}
                </Grid>
                <Grid item xs={6}>
                    <Box sx={{ my: -7 }}>
                        <Typography variant="h5" gutterBottom>
                            Preview
                        </Typography>
                        {renderPDFPreview()}
                    </Box>
                </Grid>
            </Grid>
        </div>
    );
}

export default AgentPreferences;

