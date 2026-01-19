import { useState, useEffect } from 'react';
import { DataService, ResaleProperty } from '../../services/dataService';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogAction, AlertDialogCancel } from '../../components/ui/alert-dialog';
import {
  Building2,
  CheckCircle2,
  XCircle,
  Edit,
  Trash2,
  Eye,
  Clock,
  DollarSign,
  MapPin,
  User,
  Phone,
  Mail,
} from 'lucide-react';

export default function AdminResaleListings() {
  const [pendingProperties, setPendingProperties] = useState<ResaleProperty[]>([]);
  const [approvedProperties, setApprovedProperties] = useState<ResaleProperty[]>([]);
  const [rejectedProperties, setRejectedProperties] = useState<ResaleProperty[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedProperty, setSelectedProperty] = useState<ResaleProperty | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showApproveConfirm, setShowApproveConfirm] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  
  const [editFormData, setEditFormData] = useState<Partial<ResaleProperty>>({});
  const [rejectionReason, setRejectionReason] = useState('');
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    loadAllProperties();
  }, []);

  const loadAllProperties = async () => {
    setLoading(true);
    try {
      const [pending, approved, rejected] = await Promise.all([
        DataService.loadResaleProperties('pending'),
        DataService.loadResaleProperties('approved'),
        DataService.loadResaleProperties('rejected'),
      ]);
      setPendingProperties(pending);
      setApprovedProperties(approved);
      setRejectedProperties(rejected);
    } catch (error) {
      console.error('Error loading properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!selectedProperty) return;
    
    try {
      const success = await DataService.updateResaleProperty(selectedProperty.id, {
        approvalStatus: 'approved',
        listingStatus: 'active',
        adminNotes: adminNotes,
      });
      
      if (success) {
        await loadAllProperties();
        setShowApproveConfirm(false);
        setSelectedProperty(null);
        setAdminNotes('');
        alert('Property approved successfully!');
      }
    } catch (error) {
      console.error('Error approving property:', error);
      alert('Failed to approve property');
    }
  };

  const handleReject = async () => {
    if (!selectedProperty || !rejectionReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }
    
    try {
      const success = await DataService.updateResaleProperty(selectedProperty.id, {
        approvalStatus: 'rejected',
        rejectionReason: rejectionReason,
        adminNotes: adminNotes,
      });
      
      if (success) {
        await loadAllProperties();
        setShowRejectModal(false);
        setSelectedProperty(null);
        setRejectionReason('');
        setAdminNotes('');
        alert('Property rejected');
      }
    } catch (error) {
      console.error('Error rejecting property:', error);
      alert('Failed to reject property');
    }
  };

  const handleUpdateListingStatus = async (property: ResaleProperty, newStatus: 'active' | 'sold' | 'on-hold') => {
    try {
      const success = await DataService.updateResaleProperty(property.id, {
        listingStatus: newStatus,
      });
      
      if (success) {
        await loadAllProperties();
        alert(`Property marked as ${newStatus}`);
      }
    } catch (error) {
      console.error('Error updating listing status:', error);
      alert('Failed to update status');
    }
  };

  const handleEdit = async () => {
    if (!selectedProperty) return;
    
    try {
      const success = await DataService.updateResaleProperty(selectedProperty.id, editFormData);
      
      if (success) {
        await loadAllProperties();
        setShowEditModal(false);
        setSelectedProperty(null);
        setEditFormData({});
        alert('Property updated successfully!');
      }
    } catch (error) {
      console.error('Error updating property:', error);
      alert('Failed to update property');
    }
  };

  const handleDelete = async () => {
    if (!selectedProperty) return;
    
    try {
      const success = await DataService.deleteResaleProperty(selectedProperty.id);
      
      if (success) {
        await loadAllProperties();
        setShowDeleteConfirm(false);
        setSelectedProperty(null);
        alert('Property deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting property:', error);
      alert('Failed to delete property');
    }
  };

  const openDetailModal = (property: ResaleProperty) => {
    setSelectedProperty(property);
    setShowDetailModal(true);
  };

  const openEditModal = (property: ResaleProperty) => {
    setSelectedProperty(property);
    setEditFormData(property);
    setShowEditModal(true);
  };

  const openApproveConfirm = (property: ResaleProperty) => {
    setSelectedProperty(property);
    setAdminNotes(property.adminNotes || '');
    setShowApproveConfirm(true);
  };

  const openRejectModal = (property: ResaleProperty) => {
    setSelectedProperty(property);
    setRejectionReason('');
    setAdminNotes(property.adminNotes || '');
    setShowRejectModal(true);
  };

  const openDeleteConfirm = (property: ResaleProperty) => {
    setSelectedProperty(property);
    setShowDeleteConfirm(true);
  };

  const PropertyCard = ({ property, showActions }: { property: ResaleProperty; showActions: 'pending' | 'approved' | 'rejected' }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-gray-900 mb-1">
              {property.bhk || property.propertyType}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
              <MapPin className="w-4 h-4" />
              <span>{property.locality}, {property.city}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <DollarSign className="w-4 h-4" />
              <span className="font-semibold text-blue-600">₹{property.price}</span>
            </div>
          </div>
          
          <div className="flex flex-col gap-1">
            <Badge className={`text-xs ${
              property.listingStatus === 'active' ? 'bg-green-600' :
              property.listingStatus === 'sold' ? 'bg-gray-600' :
              'bg-yellow-600'
            }`}>
              {property.listingStatus}
            </Badge>
            <Badge className="bg-blue-600 text-xs">
              {property.sellerType}
            </Badge>
          </div>
        </div>

        {/* Seller Info */}
        <div className="bg-gray-50 rounded-lg p-3 mb-3 space-y-1">
          <div className="flex items-center gap-2 text-sm">
            <User className="w-4 h-4 text-gray-500" />
            <span className="text-gray-700">{property.sellerName}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Phone className="w-4 h-4 text-gray-500" />
            <span className="text-gray-700">{property.sellerPhone}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Mail className="w-4 h-4 text-gray-500" />
            <span className="text-gray-700">{property.sellerEmail}</span>
          </div>
        </div>

        <div className="text-xs text-gray-500 mb-3">
          Submitted: {new Date(property.submittedAt).toLocaleDateString()}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => openDetailModal(property)}
          >
            <Eye className="w-4 h-4 mr-1" />
            View
          </Button>

          {showActions === 'pending' && (
            <>
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={() => openApproveConfirm(property)}
              >
                <CheckCircle2 className="w-4 h-4 mr-1" />
                Approve
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-red-600 border-red-600 hover:bg-red-50"
                onClick={() => openRejectModal(property)}
              >
                <XCircle className="w-4 h-4 mr-1" />
                Reject
              </Button>
            </>
          )}

          {showActions === 'approved' && (
            <>
              {property.listingStatus === 'active' && (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleUpdateListingStatus(property, 'sold')}
                  >
                    Mark Sold
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleUpdateListingStatus(property, 'on-hold')}
                  >
                    On Hold
                  </Button>
                </>
              )}
              {property.listingStatus === 'sold' && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleUpdateListingStatus(property, 'active')}
                >
                  Reactivate
                </Button>
              )}
              {property.listingStatus === 'on-hold' && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleUpdateListingStatus(property, 'active')}
                >
                  Activate
                </Button>
              )}
            </>
          )}

          <Button
            size="sm"
            variant="outline"
            onClick={() => openEditModal(property)}
          >
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            className="text-red-600 border-red-600 hover:bg-red-50"
            onClick={() => openDeleteConfirm(property)}
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading resale properties...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Resale Property Listings</h1>
        <p className="text-gray-600">Manage customer-submitted resale properties</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Approval</p>
                <p className="text-3xl font-bold text-yellow-600">{pendingProperties.length}</p>
              </div>
              <Clock className="w-10 h-10 text-yellow-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Approved</p>
                <p className="text-3xl font-bold text-green-600">{approvedProperties.length}</p>
              </div>
              <CheckCircle2 className="w-10 h-10 text-green-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Listings</p>
                <p className="text-3xl font-bold text-blue-600">
                  {approvedProperties.filter(p => p.listingStatus === 'active').length}
                </p>
              </div>
              <Building2 className="w-10 h-10 text-blue-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Sold</p>
                <p className="text-3xl font-bold text-gray-600">
                  {approvedProperties.filter(p => p.listingStatus === 'sold').length}
                </p>
              </div>
              <DollarSign className="w-10 h-10 text-gray-600 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-3">
          <TabsTrigger value="pending">
            Pending ({pendingProperties.length})
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved ({approvedProperties.length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected ({rejectedProperties.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-6">
          {pendingProperties.length === 0 ? (
            <Card className="p-12 text-center">
              <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Pending Approvals</h3>
              <p className="text-gray-600">All properties have been reviewed</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingProperties.map((property) => (
                <PropertyCard key={property.id} property={property} showActions="pending" />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="approved" className="mt-6">
          {approvedProperties.length === 0 ? (
            <Card className="p-12 text-center">
              <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Approved Properties</h3>
              <p className="text-gray-600">Approve pending properties to see them here</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {approvedProperties.map((property) => (
                <PropertyCard key={property.id} property={property} showActions="approved" />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="rejected" className="mt-6">
          {rejectedProperties.length === 0 ? (
            <Card className="p-12 text-center">
              <XCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Rejected Properties</h3>
              <p className="text-gray-600">Rejected properties will appear here</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rejectedProperties.map((property) => (
                <PropertyCard key={property.id} property={property} showActions="rejected" />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Detail Modal */}
      <AlertDialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <AlertDialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          {selectedProperty && (
            <>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {selectedProperty.bhk || selectedProperty.propertyType} - {selectedProperty.locality}
                </AlertDialogTitle>
              </AlertDialogHeader>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-600">Price</Label>
                    <p className="font-semibold">₹{selectedProperty.price}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Area</Label>
                    <p className="font-semibold">{selectedProperty.area}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">City</Label>
                    <p className="font-semibold">{selectedProperty.city}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Locality</Label>
                    <p className="font-semibold">{selectedProperty.locality}</p>
                  </div>
                </div>

                <div>
                  <Label className="text-gray-600">Description</Label>
                  <p className="text-sm whitespace-pre-line">{selectedProperty.description}</p>
                </div>

                {selectedProperty.keyHighlights && selectedProperty.keyHighlights.length > 0 && (
                  <div>
                    <Label className="text-gray-600">Key Highlights</Label>
                    <ul className="list-disc list-inside text-sm">
                      {selectedProperty.keyHighlights.map((highlight, idx) => (
                        <li key={idx}>{highlight}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedProperty.adminNotes && (
                  <div>
                    <Label className="text-gray-600">Admin Notes</Label>
                    <p className="text-sm bg-yellow-50 p-2 rounded">{selectedProperty.adminNotes}</p>
                  </div>
                )}

                {selectedProperty.rejectionReason && (
                  <div>
                    <Label className="text-gray-600">Rejection Reason</Label>
                    <p className="text-sm bg-red-50 p-2 rounded text-red-800">{selectedProperty.rejectionReason}</p>
                  </div>
                )}
              </div>

              <AlertDialogFooter>
                <Button onClick={() => setShowDetailModal(false)}>Close</Button>
              </AlertDialogFooter>
            </>
          )}
        </AlertDialogContent>
      </AlertDialog>

      {/* Approve Confirm Dialog */}
      <AlertDialog open={showApproveConfirm} onOpenChange={setShowApproveConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve Property</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to approve this property? It will be visible to all users.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div>
            <Label htmlFor="admin-notes">Admin Notes (Optional)</Label>
            <Textarea
              id="admin-notes"
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Add any internal notes..."
              rows={3}
            />
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleApprove} className="bg-green-600 hover:bg-green-700">
              Approve
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reject Modal */}
      <AlertDialog open={showRejectModal} onOpenChange={setShowRejectModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Property</AlertDialogTitle>
            <AlertDialogDescription>
              Please provide a reason for rejecting this property.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="rejection-reason">Rejection Reason *</Label>
              <Textarea
                id="rejection-reason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Reason for rejection (will be sent to seller)"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="admin-notes-reject">Admin Notes (Optional)</Label>
              <Textarea
                id="admin-notes-reject"
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Internal notes..."
                rows={2}
              />
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleReject} className="bg-red-600 hover:bg-red-700">
              Reject
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirm Dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Property</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete this property? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
