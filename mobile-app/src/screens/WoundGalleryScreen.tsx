import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Text,
  Chip,
  List,
  Searchbar,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

const WoundGalleryScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [woundImages, setWoundImages] = useState([
    {
      id: 1,
      patientName: 'John Smith',
      woundType: 'Pressure Ulcer',
      location: 'Sacrum',
      date: '2024-01-15',
      imageUrl: 'https://via.placeholder.com/300x200/FF5722/FFFFFF?text=Wound+Image+1',
      severity: 'Stage 3',
      measurements: { length: 4.2, width: 3.1, depth: 0.8 },
      notes: 'Significant improvement in granulation tissue',
    },
    {
      id: 2,
      patientName: 'John Smith',
      woundType: 'Pressure Ulcer',
      location: 'Sacrum',
      date: '2024-01-08',
      imageUrl: 'https://via.placeholder.com/300x200/2196F3/FFFFFF?text=Wound+Image+2',
      severity: 'Stage 3',
      measurements: { length: 4.5, width: 3.3, depth: 1.0 },
      notes: 'Initial assessment - necrotic tissue present',
    },
    {
      id: 3,
      patientName: 'Mary Johnson',
      woundType: 'Diabetic Ulcer',
      location: 'Right Heel',
      date: '2024-01-14',
      imageUrl: 'https://via.placeholder.com/300x200/4CAF50/FFFFFF?text=Wound+Image+3',
      severity: 'Stage 2',
      measurements: { length: 2.1, width: 1.8, depth: 0.3 },
      notes: 'Good epithelialization progress',
    },
    {
      id: 4,
      patientName: 'Robert Davis',
      woundType: 'Surgical Wound',
      location: 'Abdomen',
      date: '2024-01-13',
      imageUrl: 'https://via.placeholder.com/300x200/FF9800/FFFFFF?text=Wound+Image+4',
      severity: 'Stage 1',
      measurements: { length: 3.0, width: 2.5, depth: 0.2 },
      notes: 'Surgical site healing well',
    },
  ]);

  const patients = [...new Set(woundImages.map(img => img.patientName))];

  const filteredImages = woundImages.filter(img =>
    (selectedPatient ? img.patientName === selectedPatient : true) &&
    (searchQuery ? 
      img.woundType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      img.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      img.notes.toLowerCase().includes(searchQuery.toLowerCase())
      : true)
  );

  const getSeverityColor = (severity) => {
    switch (severity.toLowerCase()) {
      case 'stage 1':
        return '#4CAF50';
      case 'stage 2':
        return '#8BC34A';
      case 'stage 3':
        return '#FF9800';
      case 'stage 4':
        return '#F44336';
      default:
        return '#2196F3';
    }
  };

  const handleImagePress = (image) => {
    navigation.navigate('ImageDetail', { image });
  };

  const handleCompareImages = () => {
    // Implementation for image comparison
    Alert.alert('Image Comparison', 'Image comparison feature would be implemented here.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.headerTitle}>Wound Gallery</Title>
        <Text style={styles.headerSubtitle}>Track wound healing progress</Text>
      </View>

      <Searchbar
        placeholder="Search wounds..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />

      {/* Patient Filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.patientFilter}>
        <Button
          mode={selectedPatient === null ? 'contained' : 'outlined'}
          onPress={() => setSelectedPatient(null)}
          style={styles.filterButton}
        >
          All Patients
        </Button>
        {patients.map((patient) => (
          <Button
            key={patient}
            mode={selectedPatient === patient ? 'contained' : 'outlined'}
            onPress={() => setSelectedPatient(patient)}
            style={styles.filterButton}
          >
            {patient}
          </Button>
        ))}
      </ScrollView>

      <ScrollView style={styles.scrollView}>
        {/* Statistics */}
        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <Card.Content>
              <View style={styles.statHeader}>
                <Icon name="photo-library" size={24} color="#2196F3" />
                <Text style={styles.statTitle}>Total Images</Text>
              </View>
              <Text style={styles.statValue}>{woundImages.length}</Text>
            </Card.Content>
          </Card>

          <Card style={styles.statCard}>
            <Card.Content>
              <View style={styles.statHeader}>
                <Icon name="people" size={24} color="#4CAF50" />
                <Text style={styles.statTitle}>Patients</Text>
              </View>
              <Text style={styles.statValue}>{patients.length}</Text>
            </Card.Content>
          </Card>
        </View>

        {/* Quick Actions */}
        <Card style={styles.quickActionsCard}>
          <Card.Content>
            <Title>Quick Actions</Title>
            <View style={styles.actionButtons}>
              <Button
                mode="contained"
                onPress={() => navigation.navigate('AI Analysis')}
                style={[styles.actionButton, { backgroundColor: '#2196F3' }]}
                icon="camera-alt"
              >
                Take Photo
              </Button>
              <Button
                mode="contained"
                onPress={handleCompareImages}
                style={[styles.actionButton, { backgroundColor: '#4CAF50' }]}
                icon="compare"
              >
                Compare Images
              </Button>
            </View>
          </Card.Content>
        </Card>

        {/* Image Gallery */}
        <Card style={styles.galleryCard}>
          <Card.Content>
            <Title>Wound Images</Title>
            {filteredImages.map((image) => (
              <Card key={image.id} style={styles.imageCard}>
                <Card.Content>
                  <View style={styles.imageHeader}>
                    <View>
                      <Text style={styles.patientName}>{image.patientName}</Text>
                      <Text style={styles.imageDate}>{image.date}</Text>
                    </View>
                    <Chip
                      mode="outlined"
                      textStyle={{ color: getSeverityColor(image.severity) }}
                      style={{ borderColor: getSeverityColor(image.severity) }}
                    >
                      {image.severity}
                    </Chip>
                  </View>
                  
                  <TouchableOpacity onPress={() => handleImagePress(image)}>
                    <Image
                      source={{ uri: image.imageUrl }}
                      style={styles.woundImage}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                  
                  <View style={styles.imageDetails}>
                    <Text style={styles.woundType}>{image.woundType}</Text>
                    <Text style={styles.location}>Location: {image.location}</Text>
                    <Text style={styles.measurements}>
                      Measurements: {image.measurements.length}×{image.measurements.width}×{image.measurements.depth} cm
                    </Text>
                    <Text style={styles.notes}>{image.notes}</Text>
                  </View>
                  
                  <View style={styles.imageActions}>
                    <Button
                      mode="outlined"
                      onPress={() => handleImagePress(image)}
                      icon="visibility"
                      compact
                    >
                      View
                    </Button>
                    <Button
                      mode="outlined"
                      onPress={() => navigation.navigate('AI Analysis', { imageId: image.id })}
                      icon="psychology"
                      compact
                    >
                      AI Analysis
                    </Button>
                  </View>
                </Card.Content>
              </Card>
            ))}
          </Card.Content>
        </Card>

        {/* Timeline View */}
        <Card style={styles.timelineCard}>
          <Card.Content>
            <Title>Healing Timeline</Title>
            {filteredImages
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .map((image, index) => (
                <List.Item
                  key={image.id}
                  title={`${image.patientName} - ${image.woundType}`}
                  description={`${image.date} • ${image.location}`}
                  left={() => (
                    <View style={styles.timelineDot}>
                      <Icon name="fiber-manual-record" size={12} color="#2196F3" />
                    </View>
                  )}
                  right={() => (
                    <Chip
                      mode="outlined"
                      textStyle={{ color: getSeverityColor(image.severity) }}
                      style={{ borderColor: getSeverityColor(image.severity) }}
                    >
                      {image.severity}
                    </Chip>
                  )}
                  onPress={() => handleImagePress(image)}
                />
              ))}
          </Card.Content>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    elevation: 2,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  searchbar: {
    margin: 16,
    elevation: 2,
  },
  patientFilter: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  filterButton: {
    marginRight: 8,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    width: '48%',
    elevation: 2,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statTitle: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  quickActionsCard: {
    marginBottom: 16,
    elevation: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  galleryCard: {
    marginBottom: 16,
    elevation: 2,
  },
  imageCard: {
    marginBottom: 16,
    elevation: 1,
  },
  imageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  patientName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  imageDate: {
    fontSize: 12,
    color: '#666',
  },
  woundImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  imageDetails: {
    marginBottom: 12,
  },
  woundType: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  location: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  measurements: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  notes: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  imageActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timelineCard: {
    marginBottom: 16,
    elevation: 2,
  },
  timelineDot: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default WoundGalleryScreen;