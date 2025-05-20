import { Bike, BikeStatus } from '@/interfaces/bike';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  FlatList,
  Button,
} from 'react-native';
import LoadingWheel from '../LoadingWheel';
import { deleteBike, getBikes } from '@/apis/bikeApis';
import Popup from '../Popup';

export interface BikeListHandle {
  getUnusedBikes: () => Bike[];
  invokeReload: () => void;
}

interface Props {
  onPress: (bike: Bike) => void;
  enableDelete: boolean;
}

const PAGE_SIZE = 50;

// eslint-disable-next-line react/display-name
const UnusedBikeList = forwardRef<BikeListHandle, Props>(
  ({ onPress, enableDelete }, ref) => {
    const [isLoading, setLoading] = useState(false);
    const [bikeList, setBikeList] = useState<Bike[]>([]);
    const [page, setPage] = useState(1);
    const [isLast, setLast] = useState(false);
    const [delBike, setDeleteBike] = useState('');
    const [reloader, setReloader] = useState(0);

    const fetchData = async () => {
      setLoading(true);
      let bList: Bike[] = [];
      let initPage = 0;
      let isLastPage = false;

      do {
        const response = await getBikes(initPage + 1, PAGE_SIZE);
        isLastPage = !response.hasNextPage;
        initPage = response.page;
        const newData = response.items.filter((element) => {
          if (
            element.currentStationId != null ||
            element.bikeStatus !== BikeStatus.Available
          )
            return false;
          return !bList.some((bike) => bike.id === element.id);
        });
        bList = [...bList, ...newData];
      } while (bList.length <= 0 && !isLastPage);

      setBikeList(bList);
      setLast(isLastPage);
      setPage(initPage);
      setLoading(false);
    };

    useEffect(() => {
      fetchData();
    }, [reloader]);

    const invokeReload = async () => {
      setReloader((p) => p + 1);
    };

    const handleLoadMore = async () => {
      if (!isLoading && !isLast) {
        setLoading(true);
        let bList: Bike[] = bikeList;
        let initPage = page;
        let isLastPage: boolean = isLast;

        do {
          const response = await getBikes(initPage + 1, PAGE_SIZE);
          isLastPage = !response.hasNextPage;
          initPage = response.page;
          const newData = response.items.filter((element) => {
            if (
              element.currentStationId != null ||
              element.bikeStatus !== BikeStatus.Available
            )
              return false;
            return !bList.some((bike) => bike.id === element.id);
          });
          bList = [...bList, ...newData];
        } while (bList.length <= 0 && !isLastPage);

        setBikeList(bList);
        setLast(isLastPage);
        setPage(initPage);
        setLoading(false);
      }
    };

    const getUnusedBikes = () => {
      return bikeList;
    };

    const onDeleteBike = async () => {
      await deleteBike(delBike);
      setDeleteBike('');
      invokeReload();
    };

    useImperativeHandle(ref, () => ({
      getUnusedBikes,
      invokeReload,
    }));

    return (
      <>
        <FlatList
          style={styles.menuContainer}
          data={bikeList}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => onPress(item)}
            >
              <Image
                source={require('../../assets/images/bike-icon.png')}
                style={{ width: 40, height: 30 }}
              />
              <Text style={styles.menuText}>Bike</Text>
              {enableDelete && (
                <Button
                  title="Delete"
                  color="#f84444"
                  onPress={() => setDeleteBike(item.id)}
                />
              )}
            </TouchableOpacity>
          )}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={isLoading ? <LoadingWheel /> : null}
        />
        {enableDelete && delBike !== '' && (
          <Popup
            onCancel={() => setDeleteBike('')}
            onAccept={onDeleteBike}
            text="Remove bike?"
          ></Popup>
        )}
      </>
    );
  },
);

const styles = StyleSheet.create({
  menuContainer: {
    backgroundColor: 'white',
    marginTop: 20,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuText: {
    fontSize: 16,
    marginLeft: 15,
    flex: 1,
    color: '#333',
  },
});

export default UnusedBikeList;
