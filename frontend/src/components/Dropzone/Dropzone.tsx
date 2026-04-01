import { Box, Typography } from '@mui/material';
import {useState} from 'react';
import UploadIcon from "../icons/UploadIcon";
import './Dropzone.scss'

interface DropzoneProps {
    fileInputRef: React.RefObject<HTMLInputElement | null>;
    onSelectFile: (file: File) => boolean;
    maxFileSize?: number;
    title?: string;
    description?: string;
}

function Dropzone (
    {
        fileInputRef,
        onSelectFile,
        maxFileSize = 2 * 1024 * 1024,
        title = 'Перетащите изображение сюда или нажмите для выбора',
        description=`Максимальный размер изображения ${maxFileSize / 1024 / 1024} МБ`
    }: DropzoneProps) {

    const [isDragging, setIsDragging] = useState<boolean>(false)

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    }

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    }

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files?.[0];
        if (file) {
            if (file.size > maxFileSize) {
                return;
            }
            onSelectFile(file);
        }
    }

    return (
        <Box className='dropzone'
             onDragEnter={handleDragEnter}
             onDragLeave={handleDragLeave}
             onDragOver={handleDragOver}
             onDrop={handleDrop}
             onClick={() => fileInputRef.current?.click()}
        >
            <UploadIcon />
            <Typography className='dropzone__title' variant="body2" align="center">
                {isDragging
                    ? "Отпустите файл здесь"
                    : title}
            </Typography>
            <Typography className='dropzone__description' variant="caption" color="textSecondary">
                {description}
            </Typography>
        </Box>
    )
}

export default Dropzone;