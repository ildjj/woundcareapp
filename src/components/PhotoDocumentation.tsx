import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
  Image,
  Modal,
} from 'react-native';
import {
  Card,
  Title,
  Button,
  TextInput,
  Chip,
  IconButton,
  Portal,
  Dialog,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { launchCamera, launchImageLibrary, ImagePickerResponse, Asset } from 'react-native-image-picker';
import { LinearGradient } from 'react-native-linear-gradient';
import { analyzeWoundImage } from '../../ai';

const screenWidth = Dimensions.get('window').width;

interface PhotoDocumentationProps {
  patientId?: string;
  assessmentId?: string;
  onPhotosUpdated?: (photos: WoundPhoto[]) => void;
  initialPhotos?: WoundPhoto[];
}

interface WoundPhoto {
  id: string;
  uri: string;
  timestamp: Date;
  description: string;
  location: string;
  angle: string;
  analysis?: string;
  tags: string[];
}

export default function PhotoDocumentation({ 
  patientId, 
  assessmentId, 
  onPhotosUpdated,
  initialPhotos = []
}: PhotoDocumentationProps) {
  const [photos, setPhotos] = useState<WoundPhoto[]>(initialPhotos);
  const [selectedPhoto, setSelectedPhoto] = useState<WoundPhoto | null>(null);
  const [isPhotoModalVisible, setIsPhotoModalVisible] = useState(false);
  const [isDescriptionModalVisible, setIsDescriptionModalVisible] = useState(false);
  const [currentPhoto, setCurrentPhoto] = useState<WoundPhoto | null>(null);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [angle, setAngle] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleTakePhoto = () => {
    Alert.alert(
      'Take Photo',
      'Choose photo source',
      [
        {
          text: 'Camera',
          onPress: () => launchCamera({
            mediaType: 'photo',
            quality: 0.8,
            saveToPhotos: false,
          }, handleImageResponse),
        },
        {
          text: 'Gallery',
          onPress: () => launchImageLibrary({
            mediaType: 'photo',
            quality: 0.8,
          }, handleImageResponse),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  const handleImageResponse = (response: ImagePickerResponse) => {
    if (response.didCancel) {
      return;
    }

    if (response.errorCode) {
      Alert.alert('Error', 'Failed to capture image');
      return;
    }

    if (response.assets && response.assets[0]) {
      const asset = response.assets[0];
      const newPhoto: WoundPhoto = {
        id: Date.now().toString(),
        uri: asset.uri || '',
        timestamp: new Date(),
        description: '',
        location: '',
        angle: '',
        tags: [],
      };
      
      setCurrentPhoto(newPhoto);
      setIsDescriptionModalVisible(true);
    }
  };

  const savePhoto = () => {
    if (!currentPhoto || !description.trim()) {
      Alert.alert('Error', 'Please provide a description for the photo');
      return;
    }

    const updatedPhoto: WoundPhoto = {
      ...currentPhoto,
      description: description.trim(),
      location: location.trim(),
      angle: angle.trim(),
    };

    setPhotos(prev => [...prev, updatedPhoto]);
    setCurrentPhoto(null);
    setDescription('');
    setLocation('');
    setAngle('');
    setIsDescriptionModalVisible(false);

    if (onPhotosUpdated) {
      onPhotosUpdated([...photos, updatedPhoto]);
    }
  };

  const deletePhoto = (photoId: string) => {
    Alert.alert(
      'Delete Photo',
      'Are you sure you want to delete this photo?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updatedPhotos = photos.filter(photo => photo.id !== photoId);
            setPhotos(updatedPhotos);
            if (onPhotosUpdated) {
              onPhotosUpdated(updatedPhotos);
            }
          },
        },
      ]
    );
  };

  const analyzePhoto = async (photo: WoundPhoto) => {
    setIsAnalyzing(true);
    try {
      const analysis = await analyzeWoundImage(photo.uri);
      const updatedPhoto = { ...photo, analysis };
      setPhotos(prev => prev.map(p => p.id === photo.id ? updatedPhoto : p));
      
      if (onPhotosUpdated) {
        onPhotosUpdated(photos.map(p => p.id === photo.id ? updatedPhoto : p));
      }
    } catch (error) {
      Alert.alert('Analysis Error', 'Failed to analyze photo');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const openPhotoModal = (photo: WoundPhoto) => {
    setSelectedPhoto(photo);
    setIsPhotoModalVisible(true);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.header}>
            <Icon name="camera-alt" size={24} color="#2563eb" />
            <Title style={styles.title}>Photo Documentation</Title>
          </View>
          
          <Text style={styles.subtitle}>
            Capture and document wound photos with AI analysis
          </Text>
        </Card.Content>
      </Card>

      {/* Take Photo Button */}
      <Card style={styles.card}>
        <Card.Content>
          <Button
            mode="contained"
            onPress={handleTakePhoto}
            icon="camera"
            style={styles.takePhotoButton}
          >
            Take New Photo
          </Button>
        </Card.Content>
      </Card>

      {/* Photo Gallery */}
      {photos.length > 0 && (
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Photo Gallery ({photos.length})</Title>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photoGallery}>
              {photos.map((photo) => (
                <TouchableOpacity
                  key={photo.id}
                  style={styles.photoItem}
                  onPress={() => openPhotoModal(photo)}
                >
                  <Image source={{ uri: photo.uri }} style={styles.photoThumbnail} />
                  <View style={styles.photoOverlay}>
                    <Text style={styles.photoDate}>{formatDate(photo.timestamp)}</Text>
                    {photo.analysis && (
                      <Icon name="psychology" size={16} color="#10b981" />
                    )}
                  </View>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => deletePhoto(photo.id)}
                  >
                    <Icon name="close" size={16} color="white" />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Card.Content>
        </Card>
      )}

      {/* Photo Details */}
      {photos.length > 0 && (
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Photo Details</Title>
            {photos.map((photo) => (
              <View key={photo.id} style={styles.photoDetail}>
                <View style={styles.photoInfo}>
                  <Text style={styles.photoDescription}>{photo.description}</Text>
                  <Text style={styles.photoMeta}>
                    {photo.location && `Location: ${photo.location}`}
                    {photo.angle && ` | Angle: ${photo.angle}`}
                  </Text>
                  <Text style={styles.photoDate}>{formatDate(photo.timestamp)}</Text>
                </View>
                
                <View style={styles.photoActions}>
                  <Button
                    mode="outlined"
                    onPress={() => analyzePhoto(photo)}
                    loading={isAnalyzing}
                    disabled={isAnalyzing}
                    icon="psychology"
                    style={styles.actionButton}
                  >
                    Analyze
                  </Button>
                  
                  {photo.analysis && (
                    <Chip mode="outlined" style={styles.analysisChip}>
                      AI Analyzed
                    </Chip>
                  )}
                </View>
                
                {photo.analysis && (
                  <View style={styles.analysisContainer}>
                    <Text style={styles.analysisTitle}>AI Analysis:</Text>
                    <Text style={styles.analysisText}>{photo.analysis}</Text>
                  </View>
                )}
              </View>
            ))}
          </Card.Content>
        </Card>
      )}

      {/* Photo Modal */}
      <Portal>
        <Modal
          visible={isPhotoModalVisible}
          transparent={true}
          onRequestClose={() => setIsPhotoModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Title style={styles.modalTitle}>Photo Details</Title>
                <IconButton
                  icon="close"
                  size={24}
                  onPress={() => setIsPhotoModalVisible(false)}
                />
              </View>
              
              {selectedPhoto && (
                <>
                  <Image source={{ uri: selectedPhoto.uri }} style={styles.modalImage} />
                  <View style={styles.modalInfo}>
                    <Text style={styles.modalDescription}>{selectedPhoto.description}</Text>
                    <Text style={styles.modalMeta}>
                      {selectedPhoto.location && `Location: ${selectedPhoto.location}`}
                      {selectedPhoto.angle && ` | Angle: ${selectedPhoto.angle}`}
                    </Text>
                    <Text style={styles.modalDate}>{formatDate(selectedPhoto.timestamp)}</Text>
                    
                    {selectedPhoto.analysis && (
                      <View style={styles.modalAnalysis}>
                        <Text style={styles.modalAnalysisTitle}>AI Analysis:</Text>
                        <Text style={styles.modalAnalysisText}>{selectedPhoto.analysis}</Text>
                      </View>
                    )}
                  </View>
                </>
              )}
            </View>
          </View>
        </Modal>
      </Portal>

      {/* Description Modal */}
      <Portal>
        <Dialog
          visible={isDescriptionModalVisible}
          onDismiss={() => setIsDescriptionModalVisible(false)}
        >
          <Dialog.Title>Photo Details</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Description"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
              style={styles.input}
            />
            <TextInput
              label="Location"
              value={location}
              onChangeText={setLocation}
              style={styles.input}
            />
            <TextInput
              label="Angle"
              value={angle}
              onChangeText={setAngle}
              style={styles.input}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setIsDescriptionModalVisible(false)}>Cancel</Button>
            <Button onPress={savePhoto}>Save</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  card: {
    margin: 16,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginLeft: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  takePhotoButton: {
    marginVertical: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  photoGallery: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  photoItem: {
    marginRight: 12,
    position: 'relative',
  },
  photoThumbnail: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  photoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 4,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  photoDate: {
    fontSize: 10,
    color: 'white',
  },
  deleteButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#dc2626',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoDetail: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
  },
  photoInfo: {
    marginBottom: 8,
  },
  photoDescription: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  photoMeta: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  photoActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    marginRight: 8,
  },
  analysisChip: {
    backgroundColor: '#10b981',
  },
  analysisContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#f0fdf4',
    borderRadius: 8,
  },
  analysisTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#166534',
    marginBottom: 4,
  },
  analysisText: {
    fontSize: 14,
    color: '#166534',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    margin: 20,
    maxHeight: '80%',
    width: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  modalImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  modalInfo: {
    padding: 16,
  },
  modalDescription: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  modalMeta: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  modalDate: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 12,
  },
  modalAnalysis: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#f0fdf4',
    borderRadius: 8,
  },
  modalAnalysisTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#166534',
    marginBottom: 4,
  },
  modalAnalysisText: {
    fontSize: 14,
    color: '#166534',
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#ffffff',
  },
});