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
    selectedFile?: File | null;
}

function Dropzone (
    {
        fileInputRef,
        onSelectFile,
        maxFileSize = 2 * 1024 * 1024,
        title = 'Перетащите файл сюда или нажмите для выбора',
        description=`Максимальный размер файла ${maxFileSize / 1024 / 1024} МБ`,
        selectedFile = null
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

    const getTitleText = () => {
        if (isDragging) return "Отпустите файл здесь";
        if (selectedFile) return `${selectedFile.name}`;
        return title;
    }

    const getDescriptionText = () => {
        if (selectedFile) {
            return 'Нажмите или перетащите файл для замены';
        }
        return description;
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
                {getTitleText()}
            </Typography>
            <Typography className='dropzone__description' variant="caption" color="textSecondary">
                {getDescriptionText()}
            </Typography>
        </Box>
    )
}

export default Dropzone;